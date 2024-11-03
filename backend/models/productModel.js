const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { 
        type: String, 
        required: true 
    },
    brandName: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    productImage: {
        type: [String], 
        default: []
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    sellingPrice: { 
        type: Number, 
        required: true 
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0 
    },
    soldCount: { 
        type: Number, 
        default: 0 
    }
}, {
    timestamps: true
});

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
