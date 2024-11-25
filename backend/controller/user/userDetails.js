const userModel = require("../../models/userModel");

async function userDetailsController(req, res) {
    try {
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng",
                success: false,
            });
        }

        if(!user.phone){
            user.phone = "";
        }

        if(!user.address){
            user.address = "";
        }

        res.status(200).json({
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            success: true,
            message: "Thông tin người dùng đã được tải thành công",
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || "Đã xảy ra lỗi khi tải thông tin người dùng",
            success: false,
        });
    }
}

module.exports = userDetailsController;
