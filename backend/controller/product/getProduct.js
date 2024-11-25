const productModel = require("../../models/productModel");

const getProductController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit; 

        const allProducts = await productModel
            .find()
            .sort({ createdAt: -1 }) 
            .skip(skip) 
            .limit(limit);

        res.status(200).json({
            message: "Danh sách tât cả sản phẩm",
            success: true,
            data: allProducts
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || "Lỗi khi tải danh sách sản phẩm",
            error: true,
            success: false
        });
    }
};

module.exports = getProductController;
