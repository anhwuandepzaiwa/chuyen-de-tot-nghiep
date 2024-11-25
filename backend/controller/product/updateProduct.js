const productModel = require("../../models/productModel");
const mongoose = require("mongoose");

async function updateProductController(req, res) {
    try {
        const { _id, replaceImageIndexes, ...updateData } = req.body;

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({
                message: "ID sản phẩm không hợp lệ",
                success: false,
            });
        }

        const product = await productModel.findById(_id);
        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }

        let currentImages = product.productImage || [];

        if (req.files && req.files.length > 0) {
            if (!replaceImageIndexes || replaceImageIndexes.length !== req.files.length) {
                throw new Error("Số lượng chỉ mục hình ảnh cần thay thế không khớp với số lượng hình ảnh đã tải lên");
            }

            for (let i = 0; i < replaceImageIndexes.length; i++) {
                const index = parseInt(replaceImageIndexes[i], 10); 
                if (index >= 0 && index < currentImages.length) {
                    currentImages[index] = req.files[i].path; 
                } else {
                    throw new Error(`Chỉ mục hình ảnh không hợp lệ: ${index}`);
                }
            }

            updateData.productImage = currentImages;
        }

        const updatedProduct = await productModel.findByIdAndUpdate(_id, updateData, { new: true });

        res.status(200).json({
            message: "Cập nhật sản phẩm thành công",
            success: true,
            data: updatedProduct
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false
        });
    }
}

module.exports = updateProductController;
