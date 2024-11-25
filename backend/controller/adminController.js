const User = require("../models/userModel")
const Permission = require('../models/Permission');

exports.upgradeToEmployee = async (req, res) => {
    const { userId } = req.body; 

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                message: 'Không tìm thấy người dùng',
                success: false
            });
        }

        user.role = 'EMPLOYEE';
        await user.save();

        res.status(200).json({ 
            message: 'Người dùng đã được nâng cấp thành nhân viên', 
            user 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.assignPermissions = async (req, res) => {
    const { employeeId, permissionIds } = req.body;

    try {
        const employee = await User.findById(employeeId);
        if (!employee || employee.role !== 'EMPLOYEE') {
            return res.status(404).json({ message: 'Nhân viên không được tìm thấy hoặc không đủ điều kiện' });
        }

        // Kiểm tra quyền hợp lệ
        const validPermissions = await Permission.find({ _id: { $in: permissionIds } });
        if (validPermissions.length !== permissionIds.length) {
            return res.status(400).json({ message: 'Một số quyền không hợp lệ' });
        }

        // Gán quyền cho nhân viên
        employee.permissions = permissionIds;
        await employee.save();

        res.status(200).json({ message: 'Quyền đã được gán thành công', employee });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};