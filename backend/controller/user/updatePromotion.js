// ../controller/user/updatePromotion.js

const Promotion = require('../../models/promotionSchema');

const updatePromotion = async (req, res) => {
    try {
        const { promotionId, code, discountType, discountValue, minOrderValue, startDate, endDate, usageLimit, isActive } = req.body;

        const promotion = await Promotion.findById(promotionId);
        if (!promotion) {
            return res.status(404).json({ success: false, message: 'Mã khuyến mại không được tìm thấy' });
        }

        // Cập nhật thông tin khuyến mại
        promotion.code = code || promotion.code;
        promotion.discountType = discountType || promotion.discountType;
        promotion.discountValue = discountValue !== undefined ? discountValue : promotion.discountValue;
        promotion.minOrderValue = minOrderValue !== undefined ? minOrderValue : promotion.minOrderValue;
        promotion.startDate = startDate || promotion.startDate;
        promotion.endDate = endDate || promotion.endDate;
        promotion.usageLimit = usageLimit !== undefined ? usageLimit : promotion.usageLimit;
        promotion.isActive = isActive !== undefined ? isActive : promotion.isActive;

        await promotion.save();

        res.json({ success: true, message: 'Mã khuyến mại đã được cập nhật thành công', promotion });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Lỗi cập nhật mã giảm giá' });
    }
};

module.exports = updatePromotion;
