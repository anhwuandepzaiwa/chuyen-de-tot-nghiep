const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    subcategory: { 
        type: String, 
        required: true,
    },
    new: { 
        type: Boolean, 
        default: false 
    },
    productImage: {
        type: [String], 
        default: []
    },
    originalPrice: { 
        type: Number, 
        required: true 
    },
    discountedPrice: { 
        type: Number 
    },
    discountPercentage: { 
        type: Number, 
        default: function() {
            if (this.originalPrice && this.discountedPrice) {
                return Math.round((1 - this.discountedPrice / this.originalPrice) * 100);
            }
            return 0;
        }
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
    },
    availableColors: { 
        type: [String], 
        default: [] 
    },
    giftItems: { 
        type: [String], 
        default: [] 
    },
    averageRating: {
        type: Number,
        default: 0, 
    },
    description: { 
        introduction: { 
            type: String,  
        },
        usageInstructions: { 
            type: String 
        },
        ingredients: { 
            type: String 
        },
        basicInfo: { 
            type: String 
        },
        originInfo: { 
            type: String 
        },
        brandInfo: { 
            type: String 
        }
    },
}, {
    timestamps: true
});

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
