const Promotion = require('../../models/promotionSchema');

const getAllPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find();

        res.json({ 
            success: true, 
            promotions });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message || 'Lỗi không lấy được mã giảm giá' });
    }
};

module.exports = getAllPromotions;