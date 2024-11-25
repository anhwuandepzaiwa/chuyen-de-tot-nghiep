// models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  app_trans_id: { type: String, required: true, unique: true },
  app_user: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  description: { type: String },
  callback_data: { type: Object },
  created_at: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
