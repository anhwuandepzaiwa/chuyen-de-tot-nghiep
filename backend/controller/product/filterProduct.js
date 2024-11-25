const productModel = require("../../models/productModel");

const filterProductController = async (req, res) => {
  try {
    const categoryList = req.body.category || [];
    const subcategoryList = req.body.subcategory || [];
    const minSoldCount = req.body.minSoldCount || 0;
    const sortBy = req.body.sortBy || "priceAsc"; 

    let sortCriteria = {};
    switch (sortBy) {
      case "priceAsc": 
        sortCriteria = { price: 1 };
        break;
      case "priceDesc": 
        sortCriteria = { price: -1 };
        break;
      case "nameAsc": 
        sortCriteria = { name: 1 };
        break;
      case "nameDesc": 
        sortCriteria = { name: -1 };
        break;
      case "oldest": 
        sortCriteria = { createdAt: 1 };
        break;
      case "newest": 
        sortCriteria = { createdAt: -1 };
        break;
      case "bestSelling": 
        sortCriteria = { soldCount: -1 };
        break;
      default:
        sortCriteria = { price: 1 }; 
    }

    const filter = {
      category: { "$in": categoryList },
      subcategory: { "$in": subcategoryList },
      soldCount: { "$gte": minSoldCount }
    };

    const totalProducts = await productModel.countDocuments(filter);

    const products = await productModel
      .find(filter)
      .sort(sortCriteria);

    res.json({
      totalProducts, 
      data: products,
      message: "Lọc sản phẩm thành công",
      success: true
    });
  } catch (err) {
    res.json({
      message: err.message || "Lỗi khi lọc sản phẩm",
      success: false
    });
  }
};

module.exports = filterProductController;
