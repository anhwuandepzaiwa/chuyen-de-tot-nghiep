const jwt = require("jsonwebtoken");
const userModel = require("../../models/userModel");
require("dotenv").config();

async function confirmEmailController(req, res) {
    try {
        const token = req.query.token?.trim();

        if (!token) {
            return res.status(400).json({
                message: "Không tìm thấy token trong yêu cầu.",
                success: false
            });
        }

        // Verify the token
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, async (err, decoded) => {
            if (err) {
                console.error("Xác nhận token thất bại", err.message);
                return res.status(400).json({
                    message: "Liên kết xác nhận không hợp lệ hoặc đã hết hạn.",
                    success: false
                });
            }

            const user = await userModel.findById(decoded.id);
            if (!user) {
                return res.status(404).json({
                    message: "Người dùng không tồn tại.",
                    success: false
                });
            }

            if (user.isConfirmed) {
                return res.status(400).json({
                    message: "Email đã được xác nhận trước đó.",
                    success: false
                });
            }

            user.isConfirmed = true;
            user.token = null;
            user.otp = null;
            user.otpExpiresAt = null;
            await user.save();

            res.status(200).json({
                message: "Email đã được xác nhận thành công.",
                success: true
            });
        });
    } catch (err) {
        res.status(500).json({
            message: "Lỗi khi xác nhận email: " + err.message,
            success: false
        });
    }
}

module.exports = confirmEmailController;
