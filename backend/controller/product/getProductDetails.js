const productModel = require("../../models/productModel");
const mongoose = require("mongoose");

const getProductDetails = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                message: "Chưa cung cấp ID sản phẩm",
                success: false
            });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "ID sản phẩm không hợp lệ",
                success: false,
            });
        }

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Sản phẩm không tồn tại",
                success: true,
                data: null
            });
        }

        res.status(200).json({
            data: product,
            message: "Chi tiết sản phẩm đã được tải thành công",
            success: true,
        });

    } catch (err) {
        res.status(500).json({
            message: err?.message || "Lỗi khi tải chi tiết sản phẩm",
            success: false
        });
    }
};

module.exports = getProductDetails;
