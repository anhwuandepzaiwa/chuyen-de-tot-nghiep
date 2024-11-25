const Wishlist = require('../models/wishlist');
const Product = require('../models/productModel');
const mongoose = require('mongoose'); 

exports.addToWishlist = async (req, res) => {
    const { productId } = req.body;
    const userId = req.userId; 

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let wishlist = await Wishlist.findOne({ userId });
        
        if (!wishlist) {
            wishlist = new Wishlist({
                userId,
                productIds: [productId],
            });
        } else {
            if (wishlist.productIds.includes(productId)) {
                return res.status(400).json({ message: 'Product already in wishlist' });
            }

            wishlist.productIds.push(productId);
        }

        await wishlist.save();

        res.status(200).json({ message: 'Product added to wishlist', wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getWishlist = async (req, res) => {
    const userId = req.userId; 
    const { page = 1, limit = 10 } = req.query; 

    try {
        const wishlist = await Wishlist.findOne({ userId }).populate({
            path: 'productIds',
            select: 'productName originalPrice discountedPrice productImage',
            options: {
                skip: (page - 1) * limit,
                limit: parseInt(limit),
            },
        });

        if (!wishlist || wishlist.productIds.length === 0) {
            return res.status(404).json({ message: 'No wishlist found' });
        }

        const totalItems = await Wishlist.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $project: { total: { $size: '$productIds' } } },
        ]);

        const totalProducts = totalItems[0]?.total || 0;
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({
            currentPage: parseInt(page),
            totalPages,
            totalProducts,
            products: wishlist.productIds, 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromWishlist = async (req, res) => {
    const { productId } = req.body;
    const userId = req.userId; 

    try {
        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        const productIndex = wishlist.productIds.indexOf(productId);
        if (productIndex === -1) {
            return res.status(400).json({ message: 'Product not in wishlist' });
        }

        wishlist.productIds.splice(productIndex, 1);
        await wishlist.save();

        res.status(200).json({ message: 'Product removed from wishlist', wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

