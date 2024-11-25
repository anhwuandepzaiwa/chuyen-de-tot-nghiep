const cloudinary = require("cloudinary").v2;
const productModel = require("../../models/productModel");
const mongoose = require("mongoose");

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.query;

        if (!productId) {
            return res.status(400).json({
                message: "ID sản phẩm không được cung cấp",
                error: true,
                success: false,
            });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "ID sản phẩm không hợp lệ",
                success: false,
            });
        }

        const deletedProduct = await productModel.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Sản phẩm không tồn tại",
                success: false,
            });
        }

        const productImages = deletedProduct.productImage;
        if (productImages && productImages.length > 0) {
            for (const imagePath of productImages) {

                const publicId = imagePath.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
        }

        res.status(200).json({
            message: "Sản phẩm " + deletedProduct.productName +"đã được xóa thành công",
            success: true,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Lỗi khi xóa sản phẩm",
            success: false,
        });
    }
};

module.exports = deleteProduct;
