const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'], // Giảm theo phần trăm hoặc giảm số tiền cố định
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
    },
    minOrderValue: {
        type: Number,
        default: 0, // Giá trị đơn hàng tối thiểu để áp dụng mã giảm giá
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
    },
    usageLimit: {
        type: Number, // Giới hạn số lần sử dụng
        default: null, // Không giới hạn nếu không đặt
    },
    usedCount: {
        type: Number,
        default: 0, // Số lần đã sử dụng
    },
    isActive: {
        type: Boolean,
        default: true, // Kiểm soát trạng thái hoạt động của mã giảm giá
    },
}, {
    timestamps: true
});

const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;
