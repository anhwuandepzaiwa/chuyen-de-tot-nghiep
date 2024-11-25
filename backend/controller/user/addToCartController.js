const addToCartModel = require("../../models/cartProduct");
const productModel = require("../../models/productModel");
const mongoose = require("mongoose");

const addToCartController = async (req, res) => {
    try {
        // Lấy dữ liệu từ body request
        const { productId, quantity, selectedColor, selectedGift } = req.body;

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
                success: false,
            });
        }

        if (selectedColor && !product.availableColors.includes(selectedColor)) {
            return res.status(400).json({
                message: "Màu sắc đã chọn không hợp lệ",
                success: false,
                error: true
            });
        }

        if (selectedGift && !product.giftItems.includes(selectedGift)) {
            return res.status(400).json({
                message: "Quà tặng đã chọn không hợp lệ",
                success: false,
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                message: `Chỉ còn ${product.stock} sản phẩm trong kho`,
                success: false,
            });
        }

        const isProductAvailable = await addToCartModel.findOne({
            productId,
            userId: req.userId,
            selectedColor,
            selectedGift
        });

        if (isProductAvailable) {
            // Cập nhật số lượng
            const updatedQuantity = isProductAvailable.quantity + quantity;

            // Kiểm tra số lượng vượt quá tồn kho
            if (updatedQuantity > product.stock) {
                return res.status(400).json({
                    message: `Bạn chỉ có thể thêm tối đa ${product.stock - isProductAvailable.quantity} sản phẩm nữa`,
                    success: false,
                });
            }

            // Cập nhật số lượng sản phẩm
            isProductAvailable.quantity = updatedQuantity;
            await isProductAvailable.save();

            return res.json({
                data: isProductAvailable,
                message: "Đã cập nhật số lượng sản phẩm trong giỏ hàng",
                success: true,
            });
        }

        const payload = {
            productId,
            quantity: quantity || 1, 
            userId: req.userId,
            selectedColor,
            selectedGift
        };

        const newAddToCart = new addToCartModel(payload);
        const saveProduct = await newAddToCart.save();

        return res.json({
            data: saveProduct,
            message: "Sản phẩm đã được thêm vào giỏ hàng",
            success: true,
        });

    } catch (err) {
        return res.status(500).json({
            message: err?.message || err,
            success: false,
        });
    }
};

module.exports = addToCartController;
