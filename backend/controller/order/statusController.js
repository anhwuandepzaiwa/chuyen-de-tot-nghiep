const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const qs = require('qs');
const config = require('../../config/zaloPayConfig');

exports.checkOrderStatus = async (req, res) => {
  const { app_trans_id } = req.body;

  try {
    const postData = {
      app_id: config.app_id,
      app_trans_id,
    };

    const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const response = await axios.post(config.queryEndpoint, qs.stringify(postData), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error checking order status:', error.message);
    res.status(500).json({ message: 'Error checking order status', error: error.message });
  }
};
