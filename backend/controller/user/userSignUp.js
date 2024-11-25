const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const sendMail = require("../../helpers/send.mail");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); 
require("dotenv").config();

async function userSignUpController(req, res) {
    try {
        const { email, password, confirmPassword, name } = req.body;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!email) {
            return res.status(400).json({
                message: "Vui lòng cung cấp email",
                success: false
            });
        }else if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Email không hợp lệ. Vui lòng nhập đúng định dạng email.",
                success: false
            });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!password) {
            return res.status(400).json({
                message: "Vui lòng cung cấp mật khẩu",
                success: false
            });
        }else if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Mật khẩu phải bao gồm ít nhất 8 ký tự một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.",
                success: false
            });
        }

        if (!confirmPassword) {
            return res.status(400).json({
                message: "Vui lòng cung cấp xác nhận mật khẩu",
                success: false
            });
        }
        else if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Mật khẩu và xác nhận mật khẩu không khớp",
                success: false
            });
        }
        
        const nameRegex = /^[a-zA-Z0-9\s]{2,50}$/;
        if(!name){
            return res.status(400).json({
                message: "Vui lòng cung cấp tên",
                success: false
            });
        }else if (!nameRegex.test(name)) {
            return res.status(400).json({
                message: "Tên phải chứa ít nhất 2 ký tự và không chứa ký tự đặc biệt.",
                success: false
            });
        }

        const existingUser = await userModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                message: "Người dùng đã tồn tại với email này",
                success: false
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const otp = crypto.randomInt(100000, 999999);
        const otpExpiryTime = 15 * 60 * 1000;

        const userData = new userModel({
            email,
            password: hashPassword,
            name,
            role: "GENERAL",
            isConfirmed: false,
            otp,
            otpExpiresAt: new Date(Date.now() + otpExpiryTime)
        });

        const savedUser = await userData.save();
        const token = jwt.sign({ id: savedUser._id, email: savedUser.email }, process.env.TOKEN_SECRET_KEY, { expiresIn: '24d' });
        savedUser.token = token;  
        await savedUser.save();

        const confirmationUrl = `http://localhost:8080/api/confirm-email?token=${token}`;
        await sendMail({
            email: savedUser.email,
            subject: "Please Confirm Your Email",
            html: `
                <h1>Welcome ${name}!</h1>
                <p>To confirm your email, please use one of the following options:</p>
                <ul>
                    <li>Enter this OTP: <strong>${otp}</strong></li>
                    <li>Or click the confirmation link: <a href="${confirmationUrl}">Confirm Email</a></li>
                </ul>
                <p>Note: The OTP expires in 15 minutes, and the link expires in 24 hours.</p>
            `
        });

        res.status(201).json({
            data: savedUser,
            success: true,
            error: false,
            message: "Người dùng đã được tạo thành công. Vui lòng kiểm tra email của bạn để xác nhận tài khoản."
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || "Lỗi không xác định",
            success: false
        });
    }
}

module.exports = userSignUpController;
