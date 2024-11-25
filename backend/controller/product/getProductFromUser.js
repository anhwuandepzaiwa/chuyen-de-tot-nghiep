const productModel = require("../../models/productModel");

const getProductFromUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit; 
        const category = req.query.category; 
        const subcategory = req.query.subcategory;
        const isNew = req.query.new === 'true';  

        const filter = {};
        if (category) filter.category = category;
        if (subcategory) filter.subcategory = subcategory;
        if (isNew) filter.new = true;  

        const totalProducts = await productModel.countDocuments(filter);

        const allProducts = await productModel
            .find(filter)
            .sort({ createdAt: -1 }) 
            .skip(skip) 
            .limit(limit);

        res.status(200).json({
            message: "Sản phẩm đã được tải thành công",
            success: true,
            totalProducts,  
            data: allProducts
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || "Lỗi khi tải sản phẩm",
            error: true,
            success: false
        });
    }
};

module.exports = getProductFromUser;
