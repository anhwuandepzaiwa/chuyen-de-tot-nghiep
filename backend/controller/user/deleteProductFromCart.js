const addToCartModel = require("../../models/cartProduct")

const deleteProductFromCart = async (req, res) => {
    try {
        const { productId } = req.query;  

        const cartItem = await addToCartModel.findOneAndDelete({
            userId: req.userId,
            productId: productId, 
        });

        if (!cartItem) {
            return res.status(404).json({
                message: "Product not found in cart",
                success: false,
                error: true,
            });
        }

        res.json({
            message: "Product removed from cart successfully",
            success: true,
            error: false,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
};

module.exports = deleteProductFromCart;
