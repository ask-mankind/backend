const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middlewares/auth');

// Register a new user
router.post('/', userController.register);

// get all users
router.get('/', userController.getAllUsers);

// get a user
router.get('/:userId', userController.getUser);

// Log in a user
router.post('/login', userController.login);

// Log out a user
router.post('/logout', requireAuth, userController.logout);

// Update a user (protected route)
router.patch('/:id', requireAuth, userController.updateUser);

// Delete a user (protected route)
router.delete('/:id', requireAuth, userController.deleteUser);

module.exports = router;
