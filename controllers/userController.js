const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const maxAge = 24 * 60 * 60; // Token expiration time in seconds

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
    if (!users) return res.status(404).send('Users not found');
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get a user
exports.getUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

// Register a new user
exports.register = async (req, res) => {
    try {
      const { fullName, username, email, password } = req.body;
  
      // Check if the email or username is already in use
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ error: 'Email or username is already in use' });
      }
  
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        fullName,
        username,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      // Create a token
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: maxAge,
      });
  
      // Set the token as a cookie
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
  
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while registering the user' });
    }
  };
  
  // Log in a user
  exports.login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }
  
      const token = jwt.sign({ userId: user._id }, 'asdasdsd', {
        expiresIn: '1h',
      });
  
      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
  
// Log out a user
exports.logout = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json(error);
  }
};
