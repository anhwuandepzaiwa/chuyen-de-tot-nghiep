const Review = require('../models/review');
const Product = require('../models/productModel');

// Thêm đánh giá
exports.createReview = async (req, res) => {
    const { productId, rating, comment } = req.body;
    const userId = req.userId; 

    try {
        // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
        const existingReview = await Review.findOne({ productId, userId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const review = new Review({ productId, userId, rating, comment });
        await review.save();

        // Tính lại trung bình điểm đánh giá cho sản phẩm
        await updateProductRating(productId);

        res.status(201).json({ message: 'Review created successfully', review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật đánh giá
exports.updateReview = async (req, res) => {
    const { id } = req.params; // ID của đánh giá
    const { rating, comment } = req.body;
    const userId = req.userId; // Lấy từ middleware xác thực

    try {
        const review = await Review.findOne({ _id: id, userId });
        if (!review) {
            return res.status(404).json({ message: 'Review not found or not authorized' });
        }

        if (rating) review.rating = rating;
        if (comment) review.comment = comment;

        await review.save();

        // Tính lại trung bình điểm đánh giá cho sản phẩm
        await updateProductRating(review.productId);

        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa đánh giá
exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    const isAdmin = req.useRole === 'ADMIN';

    try {
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.userId.toString() !== userId.toString() && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        await review.deleteOne();

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách đánh giá cho sản phẩm
exports.getReviewsByProduct = async (req, res) => {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query; // Mặc định page 1, limit 10

    try {
        // Sử dụng skip và limit để phân trang
        const reviews = await Review.find({ productId })
            .populate('userId', 'name email') // Thêm thông tin người dùng
            .populate('productId', 'productName') // Thêm thông tin sản phẩm
            .skip((page - 1) * limit) // Bỏ qua các bản ghi từ trang trước đó
            .limit(parseInt(limit)) // Giới hạn số bản ghi trên mỗi trang
            .sort('-createdAt'); // Sắp xếp theo thời gian mới nhất

        // Lấy tổng số đánh giá để tính số trang
        const totalReviews = await Review.countDocuments({ productId });

        // Tính số trang
        const totalPages = Math.ceil(totalReviews / limit);

        res.status(200).json({
            totalReviews,
            totalPages,
            currentPage: page,
            reviews
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy đánh giá của người dùng
exports.getReviewsByUser = async (req, res) => {
    const userId = req.userId; 

    try {
        const reviews = await Review.find({ userId })
            .populate('productId', 'productName') // Thêm thông tin sản phẩm
            .sort('-createdAt'); // Sắp xếp theo thời gian mới nhất

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProductRating = async (productId) => {
    try {
        // Lấy tất cả đánh giá của sản phẩm
        const reviews = await Review.find({ productId });

        // Tính tổng điểm và số lượng đánh giá
        const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = totalRatings / reviews.length;

        // Cập nhật điểm trung bình vào bảng Product
        await Product.findByIdAndUpdate(productId, { averageRating });
    } catch (error) {
        console.error("Error updating product rating:", error);
    }
};

