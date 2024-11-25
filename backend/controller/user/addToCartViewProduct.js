const { model } = require("mongoose");
const addToCartModel = require("../../models/cartProduct");
const productModel = require("../../models/productModel");

const addToCartViewProduct = async (req, res) => {
    try {
        const cartItems = await addToCartModel.find({ userId: req.userId })
            .populate({
                path: "productId",
                model: productModel,
                select: "productName productImage availableColors originalPrice discountedPrice discountPercentage giftItems stock",
            });

        let totalAmount = 0;
        let totalQuantity = 0;

        const cartDetails = cartItems.map((item) => {
            const product = item.productId;
            if (!product) return null; 

          
            const price = product.discountedPrice || product.originalPrice;
            const totalPrice = price * item.quantity;
            totalAmount += totalPrice; 
            totalQuantity += item.quantity;

            const selectedGift = item.selectedGift;
            const giftDetails = selectedGift ? {
                giftName: selectedGift, 
                giftImage: product.giftItems.find(gift => gift === selectedGift), 
            } : null;

            return {
                productId: product._id, 
                productName: product.productName,
                productImage: product.productImage[0], 
                selectedColor: item.selectedColor, 
                originalPrice: product.originalPrice,
                discountedPrice: product.discountedPrice || null,
                discountPercentage: product.discountPercentage || 0,
                quantity: item.quantity,
                totalPrice: totalPrice,
                giftItems: giftDetails, 
            };
        }).filter(item => item !== null); 

        res.json({
            data: {
                cartDetails,
                totalAmount,
                totalQuantity, 
            },
            success: true,
            error: false,
        });

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
};

module.exports = addToCartViewProduct;
