const { json } = require('body-parser');
require('dotenv').config();
const userModel = require('../../models/userModel');
const jwt = require('jsonwebtoken');

async function emailAuthentication(req, res) 
{
    try 
    {
        const { token } = req.query;
        if (!token) 
        {
            return res.status(400).json({
                message: "Invalid or missing token",
                success: false
            });
        }

        // Verify token with the secret key
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        const user = await userModel.findById(decoded.id);

        if (!user) 
        {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }

        if (user.isConfirmed) 
        {
            return res.status(400).json({
                message: "User already confirmed",
                success: false
            });
        }

        user.isConfirmed = true;
        await user.save();

        res.status(200).json({
            message: "Email confirmed successfully",
            success: true
        });
    } 
    catch (error) 
    {
        res.status(500).json({
            message: error.message || "Invalid or expired token",
            success: false
        });
    }
}

module.exports = emailAuthentication;
