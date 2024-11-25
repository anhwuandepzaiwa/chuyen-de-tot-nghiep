const Promotion = require('../../models/promotionSchema');

const deletePromotion = async (req, res) => {
    try {
        const { promotionId } = req.params;

        const deletedPromotion = await Promotion.findByIdAndDelete(promotionId);

        if (!deletedPromotion) {
            return res.status(404).json({ success: false, message: 'Mã giảm giá không được tìm thấy' });
        }

        res.json({ success: true, message: 'Mã giảm giá đã được xóa thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Lỗi xóa mã giảm giá' });
    }
};

module.exports = deletePromotion;