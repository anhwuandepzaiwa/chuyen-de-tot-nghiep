const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

async function authToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token)
            return res.status(403).json({
                message: "Token chưa được cung cấp",
                success: false
            });

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Truy cập bị từ chối",
                    success: false
                });
            }

            req.userId = decoded?._id;
            req.userRole = decoded?.role;

            next(); 
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || "Lỗi không xác định",
            success: false,
        });
    }
}

async function checkPermission (req, res, next) {
    try
    {
        if (req.userRole === 'ADMIN') {
            next();
        }
        if (req.userRole === 'EMPLOYEE') {
            const user = await User.findById(req.userId).populate('permissions');
            const hasPermission = user.permissions.some((perm) => perm.name === requiredPermission);

            if (!hasPermission) {
                return res.status(403).json({ message: 'Permission denied' });
            }
            return next();
        }
        return res.status(403).json({ message: 'Permission denied' });
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
};

async function isAdmin(req, res, next) {
    if (req.userRole !== 'ADMIN') {
        return res.status(403).json({
            message: "Truy cập bị từ chối, chỉ có quyền ADMIN mới được phép",
            success: false,
        });
    }
    next(); 
}

module.exports = {
    authToken,
    checkPermission,
    isAdmin
};
