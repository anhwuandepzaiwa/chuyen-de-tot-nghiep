const User = require("../models/userModel")
const Permission = require('../models/Permission');

exports.upgradeToEmployee = async (req, res) => {
    const { userId } = req.body; // ID của người dùng cần nâng cấp

    try {
        // Tìm người dùng cần nâng cấp
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Nâng cấp vai trò lên Employee
        user.role = 'EMPLOYEE';
        await user.save();

        res.status(200).json({ message: 'User upgraded to Employee', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.assignPermissions = async (req, res) => {
    const { employeeId, permissionIds } = req.body; // ID nhân viên và danh sách quyền

    try {
        // Tìm nhân viên cần gán quyền
        const employee = await User.findById(employeeId);
        if (!employee || employee.role !== 'EMPLOYEE') {
            return res.status(404).json({ message: 'Employee not found or not eligible' });
        }

        // Kiểm tra quyền hợp lệ
        const validPermissions = await Permission.find({ _id: { $in: permissionIds } });
        if (validPermissions.length !== permissionIds.length) {
            return res.status(400).json({ message: 'Some permissions are invalid' });
        }

        // Gán quyền cho nhân viên
        employee.permissions = permissionIds;
        await employee.save();

        res.status(200).json({ message: 'Permissions assigned successfully', employee });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};