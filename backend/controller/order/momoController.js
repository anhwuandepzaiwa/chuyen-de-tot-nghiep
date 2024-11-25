const axios = require('axios');
const crypto = require('crypto');
const { momoConfig } = require('../../config/momoConfig');

const createPayment = async (req, res) => {
    const { accessKey, secretKey, partnerCode, redirectUrl, ipnUrl, requestType, extraData, autoCapture, lang } = momoConfig;
    const { amount } = req.body; // Lấy số tiền từ request body
  
    // Kiểm tra nếu số tiền không hợp lệ
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Invalid amount. Please provide a valid payment amount.' });
    }
  
    try {
      const orderId = partnerCode + new Date().getTime();
      const requestId = orderId;
  
      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=Payment with Momo&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
      const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
  
      const requestBody = {
        partnerCode,
        requestId,
        orderId,
        orderInfo: 'Payment with Momo',
        amount,
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        autoCapture,
        extraData,
        signature,
      };
  
      const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
};  

const handleCallback = (req, res) => {
  console.log('Callback received:', req.body);

  const { resultCode } = req.body;
  if (resultCode === 0) {
    console.log('Transaction succeeded.');
  } else {
    console.log('Transaction failed.');
  }

  return res.status(204).end();
};

const checkTransactionStatus = async (req, res) => {
  const { orderId } = req.body;

  try {
    const { accessKey, secretKey, partnerCode } = momoConfig;
    const requestId = orderId;

    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;
    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    const requestBody = {
      partnerCode,
      requestId,
      orderId,
      signature,
      lang: 'vi',
    };

    const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/query', requestBody, {
      headers: { 'Content-Type': 'application/json' },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPayment,
  handleCallback,
  checkTransactionStatus,
};
