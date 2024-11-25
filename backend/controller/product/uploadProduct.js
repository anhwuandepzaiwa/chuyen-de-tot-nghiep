const uploadProductPermission = require("../../helpers/permission")
const productModel = require("../../models/productModel")

async function UploadProductController(req, res) {
    try {
        // Lưu các đường dẫn ảnh sau khi upload lên Cloudinary
        const productImage = [];
        if (req.files) {
            for (const file of req.files) {
                productImage.push(file.path); 
            }
        }

        // Thêm ảnh vào request body
        req.body.productImage = productImage;

        req.body.giftItems = Array.isArray(req.body.giftItems)
            ? req.body.giftItems
            : req.body.giftItems ? req.body.giftItems.split(",").map(item => item.trim()) : [];

        req.body.availableColors = Array.isArray(req.body.availableColors)
            ? req.body.availableColors
            : req.body.availableColors ? req.body.availableColors.split(",").map(color => color.trim()) : [];

        // Tạo sản phẩm mới và lưu vào MongoDB
        const uploadProduct = new productModel(req.body);
        const saveProduct = await uploadProduct.save();

        res.status(201).json({
            message: "Sản phẩm đã được tạo thành công",
            success: true,
            data: saveProduct
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || "Đã xảy ra lỗi khi tạo sản phẩm",
            success: false
        });
    }
}

module.exports = UploadProductController