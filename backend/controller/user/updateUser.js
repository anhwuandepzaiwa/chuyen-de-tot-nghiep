const userModel = require("../../models/userModel");

async function updateUser(req, res) {
    try {
        const { name, phone, address } = req.body; 

        const payload = {
            ...(name && { name }),
            ...(phone && { phone }), 
            ...(address && { address })
        };

        // Cập nhật thông tin người dùng
        const updatedUser = await userModel.findByIdAndUpdate(req.userId, payload, { new: true }); // 'new: true' để trả về tài liệu đã cập nhật

        res.json({
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                role: updatedUser.role
            },
            message: "Thông tin người dùng đã được cập nhật thành công",
            success: true
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || "Đã xảy ra lỗi khi cập nhật thông tin người dùng",
            success: false,
        });
    }
}

module.exports = updateUser;
