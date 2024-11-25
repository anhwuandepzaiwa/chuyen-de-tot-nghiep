const bcrypt = require('bcryptjs')
const userModel = require('../../models/userModel')
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function userSignInController(req,res)
{
    try{
        const { email , password} = req.body

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

        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({
                message: "Không tìm thấy người dùng với email này",
                success: false
            });
        }
        
        if(!password){
            return res.status(400).json({
                message: "Vui lòng cung cấp mật khẩu",
                success: false
            });
        }

        if(!user.isConfirmed){
            return res.status(403).json({
                message: "Email chưa được xác nhận",
                success: false
            });
        }

        const checkPassword = await bcrypt.compare(password,user.password)

        if(checkPassword)
        {
        const tokenData = {
            _id : user._id,
            email : user.email,
            role: user.role
        }

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '24h' });

        // const tokenOption = {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',  // Set to true only in production
        //     sameSite: 'None'  // Required for cross-site requests
        // };
        
        res.status(200).json({
            message : "Đăng nhập thành công",
            data: {
                token,  
                name: user.name,  
                email: user.email,
                isConfirmed: user.isConfirmed
            },
            success : true,
        })

        }
        else
        {
            return res.status(400).json({
                message : "Mật khẩu không chính xác",
                success : false
            });
        }
    }
    catch(err)
    {
        console.log(err)
        res.json({
            
            message : err.message || err,
            error : true,
            success : false,
        })
    }
}

module.exports = userSignInController