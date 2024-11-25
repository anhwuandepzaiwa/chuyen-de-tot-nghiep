const Permission = require('../models/Permission');

exports.getAllPermissions = async (req, res) => {
    try {
        if (req.userRole === 'ADMIN') {
            const allPermissions = await Permission.find({});
            return res.status(200).json({ permissions: allPermissions });
        }

        if (req.userRole === 'EMPLOYEE') {
            const employee = await User.findById(req.userId).populate('permissions');
            return res.status(200).json({ permissions: employee.permissions });
        }

        res.status(403).json({ message: 'Không có quyền nào cho vai trò này' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

exports.updatePermission = async (req, res) => {
    try {
        const permission = await Permission.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(permission);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi cập nhật quyền', error: error.message });
    }
};

exports.deletePermission = async (req, res) => {
    try {
        await Permission.findByIdAndDelete(req.params.id);
        res.json({ message: 'Quyền đã bị xóa' });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi xóa quyền', error: error.message });
    }
};
