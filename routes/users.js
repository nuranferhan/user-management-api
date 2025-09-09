const express = require('express');
const router = express.Router();
const { validateUser, validateUserUpdate } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const userController = require('../controllers/userController');

// GET /api/users - Get all users
router.get('/', authenticateToken, userController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', authenticateToken, userController.getUserById);

// POST /api/users - Create new user
router.post('/', validateUser, userController.createUser);

// POST /api/users/login - Login user
router.post('/login', userController.loginUser);

// PUT /api/users/:id - Update user
router.put('/:id', authenticateToken, validateUserUpdate, userController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;