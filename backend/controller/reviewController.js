const Review = require('../models/review');
const Product = require('../models/productModel');

exports.createReview = async (req, res) => {
    const { productId, rating, comment } = req.body;
    const userId = req.userId; 

    try {
        const existingReview = await Review.findOne({ productId, userId });
        if (existingReview) {
            return res.status(400).json({ 
                message: 'Bạn đã đánh giá sản phẩm này',
                success: false
                });
        }

        const review = new Review({ productId, userId, rating, comment });
        await review.save();

        await updateProductRating(productId);

        res.status(201).json({ 
            message: 'Đánh giá được tạo thành công', 
            review,
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateReview = async (req, res) => {
    const { id } = req.params; 
    const { rating, comment } = req.body;

    try {
        const review = await Review.findOne({ _id: id, userId: req.userId});
        if (!review) {
            return res.status(404).json({ message: 'Đánh giá không tìm thấy hoặc không được ủy quyền' });
        }

        if (rating) review.rating = rating;
        if (comment) review.comment = comment;

        await review.save();

        await updateProductRating(review.productId);

        res.status(200).json({ 
            message: 'Đã cập nhật đánh giá thành công', 
            review, 
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    const isAdmin = req.useRole === 'ADMIN';

    try {
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ 
                message: 'Không tìm thấy bài đánh giá',
                success: false
            });
        }

        if (review.userId.toString() !== userId.toString() && !isAdmin) {
            return res.status(403).json({ 
                message: 'Không được phép xóa đánh giá này',
                success: false
            });
        }

        await review.deleteOne();

        res.status(200).json({ 
            message: 'Đã xóa đánh giá thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getReviewsByProduct = async (req, res) => {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query; 

    try {
        const reviews = await Review.find({ productId })
            .populate('userId', 'name email') 
            .populate('productId', 'productName') 
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort('-createdAt'); 

        const totalReviews = await Review.countDocuments({ productId });

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

