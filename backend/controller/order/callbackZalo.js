const CryptoJS = require('crypto-js');

const config = {
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz"
};

const callbackZalo = async(req, res) => {
    let result = {};

    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        // Tính toán mac từ dataStr
        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
        
        // Kiểm tra từng giá trị
        console.log("Received dataStr:", dataStr);
        console.log("Received reqMac:", reqMac);
        console.log("Calculated mac:", mac);

        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = "mac not equal";
        } else {
            let dataJson = JSON.parse(dataStr);
            console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

            result.return_code = 1;
            result.return_message = "success";
        }
    } catch (ex) {
        result.return_code = 0; 
        result.return_message = ex.message;
    }

    res.json(result);
}

module.exports = callbackZalo;
