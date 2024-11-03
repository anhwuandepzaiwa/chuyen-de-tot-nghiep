const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "GENERAL" },
    isConfirmed: { type: Boolean, default: false },
    phone: { type: String, required: false }, 
    address: { type: String, required: false } 
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
