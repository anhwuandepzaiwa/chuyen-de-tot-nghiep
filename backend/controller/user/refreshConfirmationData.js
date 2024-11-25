const userModel = require("../../models/userModel");
const crypto = require("crypto"); 
const jwt = require("jsonwebtoken");
const sendMail = require("../../helpers/send.mail");
require("dotenv").config();

async function refreshConfirmationData(req, res) {
    try {
        const { email } = req.body; 

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Người dùng không được tìm thấy", success: false });
        }

        if (user.isConfirmed) {
            return res.status(400).json({
                message: "Tài khoan đã được xác nhận. Không thể làm mới OTP hoặc liên kết xác nhận.",
                success: false
            });
        }

        const otpExpired = user.otpExpiresAt < Date.now();

        let linkExpired = false;
        if (user.token) {
            try {
                linkExpired = !user.isConfirmed && jwt.verify(user.token, process.env.TOKEN_SECRET_KEY).exp < Date.now() / 1000;
            } catch (err) {
                linkExpired = true;  
            }
        }

        if (!otpExpired && !linkExpired) {
            return res.status(400).json({
                message: "Cả OTP và liên kết xác nhận đều còn hiệu lực. Không cần làm mới.",
                success: false
            });
        }

        if (otpExpired) {
            const newOtp = crypto.randomInt(100000, 999999);
            const otpExpiryTime = 15 * 60 * 1000; // 15 minutes
            user.otp = newOtp;
            user.otpExpiresAt = new Date(Date.now() + otpExpiryTime);
        }

        if (linkExpired) {
            const newToken = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_SECRET_KEY, { expiresIn: '24h' });
            user.token = newToken;
        }

        // Save the updated user document
        await user.save();

        // Prepare confirmation URL and email content
        const confirmationUrl = `http://localhost:8080/api/confirm-email?token=${user.token}`;
        await sendMail({
            email: user.email,
            subject: "Your OTP or Confirmation Link Has Been Refreshed",
            html: `
                <h1>Hello ${user.name},</h1>
                <p>Your OTP has expired, or the confirmation link has expired. Please use one of the following options to confirm your email:</p>
                <ul>
                    <li>Enter this OTP: <strong>${user.otp}</strong></li>
                    <li>Or click the confirmation link: <a href="${confirmationUrl}">Confirm Email</a></li>
                </ul>
                <p>Note: The OTP expires in 15 minutes, and the link expires in 24 hours.</p>
            `
        });

        res.status(200).json({
            message: "Mã OTP hoặc liên kết xác nhận đã được làm mới thành công.",
            success: true
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            message: err.message || "Lỗi không xác định",
            success: false
        });
    }
}

module.exports = refreshConfirmationData;
