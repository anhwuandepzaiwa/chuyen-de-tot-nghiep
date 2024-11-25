const userModel = require("../../models/userModel");

async function verifyOtpController(req, res) {
    try {
        const email = req.body.email;
        const otp = req.body.otp.trim();

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email và mã OTP không được để trống.",
                success: false
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Người dùng không tồn tại.",
                success: false
            });
        }

        if (user.otp.toString() !== otp.toString()) {
            return res.status(400).json({
                message: "Mã OTP không hợp lệ.",
                success: false
            });
        }

        if (user.otpExpiresAt < new Date()) {
            return res.status(400).json({
                message: "Mã OTP đã hết hạn.",
                success: false
            });
        }

        user.isConfirmed = true;
        user.otp = null;
        user.otpExpiresAt = null;
        user.token = null;
        
        await user.save();

        res.status(200).json({
            message: "Tài khoản đã được xác thực thành công.",
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Lỗi không xác định",
            success: false
        });
    }
}

module.exports = verifyOtpController;
