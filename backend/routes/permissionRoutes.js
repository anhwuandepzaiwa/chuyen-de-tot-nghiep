const express = require('express');
const router = express.Router();
const permissionController = require('../controller/permissionController');
const { authToken, isAdmin} = require('../middleware/authToken');

// Route quản lý quyền
router.get('/',  authToken, permissionController.getAllPermissions);
router.post('/', authToken, isAdmin, permissionController.createPermission);
router.put('/:id', authToken, isAdmin, permissionController.updatePermission);
router.delete('/:id', authToken, isAdmin, permissionController.deletePermission);

module.exports = router;
