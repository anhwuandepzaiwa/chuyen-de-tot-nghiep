const userModel = require("../../models/userModel")
const bcrypt = require('bcryptjs');
const sendMail = require("../../helpers/send.mail")
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function userSignUpController(req,res){
    try{
        const { email, password, name} = req.body

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            throw new Error("Please provide a valid email");
        }
        if (!password || password.length < 8) {
            throw new Error("Password should be at least 8 characters long");
        }
        if (!name) {
            throw new Error("Please provide a name");
        }

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists. Please use a different email.",
                success: false
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const userData = new userModel({
            ...req.body,
            role: "GENERAL",
            password: hashPassword,
            isConfirmed: false // Add this field to track confirmation status
        });

        const savedUser = await userData.save();
        // Create a token with user's id and email for email confirmation
        const token = jwt.sign({ id: savedUser._id, email: savedUser.email }, process.env.TOKEN_SECRET_KEY, { expiresIn: '365d' });

        // Send confirmation email
        const confirmationUrl = `http://localhost:8080/api/confirm-email?token=${token}`;
        await sendMail({
            email: savedUser.email,
            subject: 'Please Confirm Your Email',
            html: `
                <h1>Welcome ${name}!</h1>
                <p>Please confirm your email by clicking the link below:</p>
                <a href="${confirmationUrl}">Confirm Email</a>
                <p>This link will expire in 24 hours.</p>
            `
        });
    
        res.status(201).json({
            data: savedUser,
            success: true,
            error: false,
            message: "User created successfully! Please check your email to confirm your account."
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || "An error occurred",
            error: true,
            success: false,
        });
    }
}

module.exports = userSignUpController;