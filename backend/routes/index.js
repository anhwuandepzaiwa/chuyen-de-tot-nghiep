const express = require('express')

const router = express.Router()

const upload = require('../config/uploadConfig');
const userSignUpController = require("../controller/user/userSignUp")
const userSignInController = require('../controller/user/userSignIn')
const userDetailsController = require('../controller/user/userDetails')
const { authToken, isAdmin } = require('../middleware/authToken');
//const signUpLimiter = require('../middleware/rateLimit')
const checkEmailConfirm = require('../middleware/checkEmailConfirm')
const userLogout = require('../controller/user/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const deleteUser = require('../controller/user/deleteUser')
const deleteAdminUser = require('../controller/user/deleteAdminUser')
const UploadProductController = require('../controller/product/uploadProduct')
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const addToCartController = require('../controller/user/addToCartController')
const countAddToCartProduct = require('../controller/user/countAddToCartProduct')
const addToCartViewProduct  = require('../controller/user/addToCartViewProduct')
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const searchProduct = require('../controller/product/searchProduct')
const deleteProductController = require('../controller/product/deleteProductController')
const filterProductController = require('../controller/product/filterProduct')
const paymentController = require('../controller/order/paymentController')
const webhooks = require('../controller/order/webhook')
const orderController = require('../controller/order/order.controller')
const allOrderController = require('../controller/order/allOrder.controller')
const paymentZalo = require('../controller/order/paymentzalo');
const callbackZalo = require('../controller/order/callbackZalo');
const confirmEmailController = require('../controller/user/emailAuthentication')

router.post("/signup",userSignUpController);
router.post("/signin", checkEmailConfirm, userSignInController);
router.get('/user-details', userDetailsController);
router.get("/userLogout",userLogout);
router.get("/confirm-email",confirmEmailController);
router.put("/user-update", authToken, updateUser);

//admin panel 
router.get("/all-user",authToken,allUsers)
router.post("/update-user",authToken,updateUser)
router.delete("/delete-user", authToken, isAdmin, deleteAdminUser)
router.delete("/delete-account", authToken, deleteUser);

//product
router.post("/upload-product", authToken, isAdmin, upload.array('productImage', 6), UploadProductController)
router.get("/get-product",getProductController)
router.post("/update-product",authToken, isAdmin ,upload.array('productImage', 6),updateProductController)
router.get("/get-categoryProduct",getCategoryProduct)
router.post("/category-product",getCategoryWiseProduct)
router.post("/product-details",getProductDetails)
router.get("/search",searchProduct)
router.post("/filter-product",filterProductController)
router.delete("/delete-product", authToken, isAdmin,deleteProductController)

//user add to cart
router.post("/addtocart",authToken,addToCartController)
router.get("/countAddToCartProduct",authToken,countAddToCartProduct)
router.get("/view-card-product",authToken,addToCartViewProduct)
router.post("/update-cart-product",authToken,updateAddToCartProduct)
router.post("/delete-cart-product",authToken,deleteAddToCartProduct)

//payment and order
router.post('/checkout',authToken,paymentController)
router.post('/webhook',webhooks) // /api/webhook
router.get("/order-list",authToken,orderController)
router.get("/all-order",authToken,allOrderController)
router.post('/paymentZalo',authToken,paymentZalo)
router.post('/callbackZalo',callbackZalo)


module.exports = router