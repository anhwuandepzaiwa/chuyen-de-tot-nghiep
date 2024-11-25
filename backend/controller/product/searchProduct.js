const productModel = require("../../models/productModel");

const searchProduct = async (req, res) => {
    try {
        const query = req.query.q?.trim();
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Kiểm tra nếu không có từ khóa tìm kiếm
        if (!query) {
            return res.status(400).json({
                message: "Vui lòng nhập từ khóa tìm kiếm",
                error: true,
                success: false
            });
        }

        const regex = new RegExp(query, 'i'); 

        const products = await productModel.find({
            "$or": [
                { productName: regex },
                { category: regex },
                { subcategory: regex }
            ]
        })
        .skip((page - 1) * limit) 
        .limit(limit); 

        if (products.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm nào",
                success: true,
                data: []
            });
        }

        res.status(200).json({
            data: products,
            message: "Tìm kiếm sản phẩm thành công",
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Lỗi khi tìm kiếm sản phẩm",
            success: false
        });
    }
};

module.exports = searchProduct;
