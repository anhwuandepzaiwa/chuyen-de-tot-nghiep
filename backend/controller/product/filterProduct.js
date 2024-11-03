const productModel = require("../../models/productModel")

const filterProductController = async (req, res) => {
  try {
    const categoryList = req?.body?.category || [];
    const sortBy = req?.body?.sortBy || "priceAsc"; // mặc định sắp xếp theo giá tăng dần

    // Định nghĩa đối tượng sort dựa trên sortBy
    let sortCriteria = {};
    switch (sortBy) {
      case "priceAsc": // Giá tăng dần
        sortCriteria = { price: 1 };
        break;
      case "priceDesc": // Giá giảm dần
        sortCriteria = { price: -1 };
        break;
      case "nameAsc": // Tên A-Z
        sortCriteria = { name: 1 };
        break;
      case "nameDesc": // Tên Z-A
        sortCriteria = { name: -1 };
        break;
      case "oldest": // Sản phẩm cũ nhất
        sortCriteria = { createdAt: 1 };
        break;
      case "newest": // Sản phẩm mới nhất
        sortCriteria = { createdAt: -1 };
        break;
      default:
        sortCriteria = { price: 1 }; // Mặc định giá tăng dần
    }

    const products = await productModel.find({
      category: {
        "$in": categoryList
      }
    }).sort(sortCriteria);

    res.json({
      data: products,
      message: "product",
      error: false,
      success: true
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
};

module.exports = filterProductController;
