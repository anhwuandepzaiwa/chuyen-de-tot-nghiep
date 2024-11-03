const productModel = require("../../models/productModel");

const deleteProductController = async (req, res) => {
    try {
        const { productId } = req.query; // Lấy productId từ query parameters

        // Kiểm tra nếu productId không được cung cấp
        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required",
                error: true,
                success: false,
            });
        }

        // Tìm sản phẩm và xóa
        const deletedProduct = await productModel.findByIdAndDelete(productId);

        // Kiểm tra nếu không tìm thấy sản phẩm
        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false,
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            error: false,
            success: true,
            data: deletedProduct,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
};

module.exports = deleteProductController;
