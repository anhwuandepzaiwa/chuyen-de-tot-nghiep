const mongoose = require('mongoose');

const addToCart = mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    userId: { type: String, required: true },
    selectedColor: { type: String },
    selectedGift: { type: String },
}, {
    timestamps: true
});

const addToCartModel = mongoose.model("addToCart", addToCart);

module.exports = addToCartModel;
