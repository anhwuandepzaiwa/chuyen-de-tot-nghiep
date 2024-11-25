const Permission = require('../models/Permission');


// Lấy tất cả quyền
exports.getAllPermissions = async (req, res) => {
    try {
        if (req.userRole === 'ADMIN') {
            // Admin có tất cả quyền
            const allPermissions = await Permission.find({});
            return res.status(200).json({ permissions: allPermissions });
        }

        if (req.userRole === 'EMPLOYEE') {
            // Lấy quyền của nhân viên
            const employee = await User.findById(req.userId).populate('permissions');
            return res.status(200).json({ permissions: employee.permissions });
        }

        // Người dùng không có quyền
        res.status(403).json({ message: 'No permissions available for this role' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo quyền mới
exports.createPermission = async (req, res) => {
    const { name, description } = req.body;
    try {
        const permission = new Permission({ name, description });
        await permission.save();
        res.status(201).json(permission);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi tạo quyền', error: error.message });
    }
};

// Cập nhật quyền
exports.updatePermission = async (req, res) => {
    try {
        const permission = await Permission.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(permission);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi cập nhật quyền', error: error.message });
    }
};

// Xóa quyền
exports.deletePermission = async (req, res) => {
    try {
        await Permission.findByIdAndDelete(req.params.id);
        res.json({ message: 'Quyền đã bị xóa' });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi xóa quyền', error: error.message });
    }
};
