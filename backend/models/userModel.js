const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['GENERAL', 'EMPLOYEE', 'ADMIN'], // Các vai trò
        default: 'GENERAL' // Mặc định khi đăng ký
    },
    permissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Permission',
        }
    ],
    isConfirmed: { type: Boolean, default: false },
    otp: { type: Number, default: null },
    otpExpiresAt: { type: Date, default: null }, 
    token: { type: String, required: false },
    phone: { type: String, required: false }, 
    address: { type: String, required: false } 
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
