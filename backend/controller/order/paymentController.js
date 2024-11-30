const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const config = require('../../config/zaloPayConfig');
const Order = require('../../models/order');

exports.createOrder = async (req, res) => {
  try {
    const { amount, app_user } = req.body;

    const transID = Math.floor(Math.random() * 1000000);
    const embed_data = { redirecturl: 'https://example.com/redirect' };
    const items = [];

    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user,
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount,
      callback_url: 'https://e981-113-185-54-133.ngrok-free.app/api/callbackZalo',
      description: `Payment for order #${transID}`,
      bank_code: '',
    };

    const data =
      config.app_id +
      '|' +
      order.app_trans_id +
      '|' +
      order.app_user +
      '|' +
      order.amount +
      '|' +
      order.app_time +
      '|' +
      order.embed_data +
      '|' +
      order.item;

    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const response = await axios.post(config.endpoint, null, { params: order });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

exports.handleCallback = async (req, res) => {
    let result = {};
    try {
      const { data: dataStr, mac: reqMac } = req.body;
      const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString(); // Sử dụng key2 trong tính toán
  
      console.log('Calculated MAC:', mac);
      console.log('Received MAC:', reqMac);
  
      if (reqMac !== mac) {
        result.return_code = -1;
        result.return_message = 'mac not equal';
      } else {
        const dataJson = JSON.parse(dataStr);
        console.log("Order successful, app_trans_id =", dataJson.app_trans_id);
  
        // Lưu thông tin vào cơ sở dữ liệu
        const order = new Order({
          app_trans_id: dataJson.app_trans_id,
          app_user: dataJson.app_user,
          amount: dataJson.amount,
          description: dataJson.description,
          status: 'completed', // Giả sử là thành công nếu MAC khớp
          callback_data: dataJson,
        });
  
        await order.save(); // Lưu vào MongoDB
  
        result.return_code = 1;
        result.return_message = 'success';
      }
    } catch (ex) {
      console.error('Callback error:', ex.message);
      result.return_code = 0;
      result.return_message = ex.message;
    }
    res.json(result);
  };
  

