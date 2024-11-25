const addToCartModel = require("../../models/cartProduct");
const productModel = require("../../models/productModel");

const updateAddToCartProduct = async (req, res) => {
    try {
        const addToCartProductId = req?.body?._id;
        const qty = req.body.quantity;

        // Kiểm tra thông tin yêu cầu
        if (!addToCartProductId || !qty || qty <= 0) {
            return res.status(400).json({
                message: "Thông tin không hợp lệ. Vui lòng kiểm tra lại.",
                success: false,
            });
        }

        // Kiểm tra sản phẩm trong giỏ hàng có tồn tại và thuộc người dùng
        const cartItem = await addToCartModel.findOne({
            _id: addToCartProductId,
            userId: req.userId,
        });

        if (!cartItem) {
            return res.status(404).json({
                message: "Sản phẩm trong giỏ hàng không tồn tại hoặc không thuộc quyền sở hữu của bạn.",
                success: false,
            });
        }

        // Lấy thông tin sản phẩm từ bảng Product
        const product = await productModel.findById(cartItem.productId);

        if (!product) {
            return res.status(404).json({
                message: "Sản phẩm không tồn tại.",
                success: false,
            });
        }

        if (qty > product.stock) {
            return res.status(400).json({
                message: `Số lượng yêu cầu vượt quá số lượng tồn kho (${product.stock} sản phẩm).`,
                success: false,
            });
        }

        cartItem.quantity = qty;
        await cartItem.save();

        res.json({
            message: "Cập nhật sản phẩm thành công.",
            data: cartItem,
            success: true,
        });
    } catch (err) {
        res.status(500).json({
            message: err?.message || "Đã xảy ra lỗi.",
            success: false,
        });
    }
};

module.exports = updateAddToCartProduct;
