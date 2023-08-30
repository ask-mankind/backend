const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { requireAuth } = require('../middleware/authMiddleware');

// Register user
router.post('/', usersController.registerUser);

// get all users
router.get('/', usersController.getAllUsers);

// get user by id
router.get('/:userId', usersController.getUser);

// Login user
router.post('/login', usersController.loginUser);

// Update user
router.put('/update', requireAuth, usersController.updateUser);

// Delete user
router.delete('/delete', requireAuth, usersController.deleteUser);

// Logout user
router.post('/logout', usersController.logoutUser);

module.exports = router;
