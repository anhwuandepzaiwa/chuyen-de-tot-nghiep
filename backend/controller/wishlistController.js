const Wishlist = require('../models/wishlist');
const Product = require('../models/productModel');
const mongoose = require('mongoose'); 

// Thêm sản phẩm vào danh sách yêu thích
exports.addToWishlist = async (req, res) => {
    const { productId } = req.body;
    const userId = req.userId; // Lấy userId từ middleware xác thực

    try {
        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Kiểm tra xem người dùng đã có danh sách yêu thích chưa
        let wishlist = await Wishlist.findOne({ userId });
        
        if (!wishlist) {
            // Nếu chưa có, tạo mới danh sách yêu thích
            wishlist = new Wishlist({
                userId,
                productIds: [productId],
            });
        } else {
            // Nếu đã có danh sách, kiểm tra sản phẩm đã tồn tại chưa
            if (wishlist.productIds.includes(productId)) {
                return res.status(400).json({ message: 'Product already in wishlist' });
            }

            // Thêm sản phẩm vào danh sách yêu thích
            wishlist.productIds.push(productId);
        }

        await wishlist.save();

        res.status(200).json({ message: 'Product added to wishlist', wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Lấy danh sách yêu thích của người dùng
exports.getWishlist = async (req, res) => {
    const userId = req.userId; // Lấy userId từ middleware xác thực
    const { page = 1, limit = 10 } = req.query; // Phân trang: mặc định page=1, limit=10

    try {
        // Lấy danh sách yêu thích của người dùng
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

        // Tính toán tổng số sản phẩm và số trang
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
            products: wishlist.productIds, // Danh sách sản phẩm yêu thích
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa sản phẩm khỏi danh sách yêu thích
exports.removeFromWishlist = async (req, res) => {
    const { productId } = req.body;
    const userId = req.userId; 

    try {
        // Tìm danh sách yêu thích của người dùng
        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        // Kiểm tra xem sản phẩm có trong danh sách không
        const productIndex = wishlist.productIds.indexOf(productId);
        if (productIndex === -1) {
            return res.status(400).json({ message: 'Product not in wishlist' });
        }

        // Xóa sản phẩm khỏi danh sách
        wishlist.productIds.splice(productIndex, 1);
        await wishlist.save();

        res.status(200).json({ message: 'Product removed from wishlist', wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

