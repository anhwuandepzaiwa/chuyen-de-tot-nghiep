const userModel = require("../../models/userModel");

async function allUsers(req, res) 
{
    try {
        const user = await userModel.findById(req.userId);
        if (user.role !== 'ADMIN') 
        {
            return res.status(403).json({
                message: "Tài khoản của bạn không có quyền truy cập",
                success: false,
            });
        }

        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const users = await userModel.find()
            .skip((page - 1) * limit) 
            .limit(limit); 

        const totalUsers = await userModel.countDocuments(); 

        res.json({
            message: "Danh sách người dùng",
            data: users,
            total: totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            success: true,
        });
    } 
    catch (err) 
    {
        res.status(400).json({
            message: err.message || "Đã xảy ra lỗi khi tải danh sách người dùng",
            success: false,
        });
    }
}

module.exports = allUsers;