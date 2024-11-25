const userModel = require("../../models/userModel");

async function deleteAdminUser(req, res) {
    try {
        const userId = req.query.userId; 

        const deletedUser = await userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng",
                success: false,
            });
        }

        res.json({
            message: "Người dùng " + deletedUser.email + " đã được xóa thành công",
            success: true,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || "Lỗi khi xóa người dùng",
            success: false,
        });
    }
}

module.exports = deleteAdminUser;