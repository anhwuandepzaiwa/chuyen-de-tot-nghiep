const userModel = require("../../models/userModel");

async function deleteUser(req, res) {
    try {
        const deletedUser = await userModel.findByIdAndDelete(req.userId);

        res.json({
            message: "Tài khoản "+ deletedUser.email + " đã được xóa thành công",
            success: true
        });
    } catch (err) {
        res.status(400).json({  
            message: err.message || "Đã xảy ra lỗi khi xóa tài khoản",
            success: false
        });
    }
}

module.exports = deleteUser;
