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

module.exports = router;
