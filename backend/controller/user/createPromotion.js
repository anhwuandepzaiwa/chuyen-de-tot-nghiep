const Promotion = require("../../models/promotionSchema")

const createPromotion = async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrderValue, startDate, endDate, usageLimit } = req.body;

        const existingPromotion = await Promotion.findOne({ code });
        if (existingPromotion) {
            return res.status(400).json({
                message: "Mã khuyến mại đã được tạo truớc đó. Vui lòng tạo mã khuyến mại khác",
                success: false
            });
        }

        const newPromotion = new Promotion({
            code,
            discountType,
            discountValue,
            minOrderValue,
            startDate,
            endDate,
            usageLimit,
            isActive: true
        });

        await newPromotion.save();

        res.status(201).json({
            message: "Mã khuyến mại đã được tạo thành công",
            success: true,
            data: newPromotion
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Lỗi khi tạo mã khuyến mại",
            success: false
        });
    }
};

module.exports = createPromotion;
