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
    const user = await User.findById(req.params.userId);

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
      return res
        .status(400)
        .json({ error: 'Email or username is already in use' });
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

    res
      .status(201)
      .json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while registering the user' });
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { fullName, username, email, newPassword } = req.body;

    // Find the user by ID
    const userToUpdate = await User.findById(userId);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if no fields are provided for update
    if (!fullName && !username && !email && !newPassword) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    // Update user information if provided
    if (fullName) {
      userToUpdate.fullName = fullName;
    }

    if (username) {
      // Check if the updated username is already in use
      const existingUserWithUsername = await User.findOne({ username });
      if (
        existingUserWithUsername &&
        existingUserWithUsername._id.toString() !== userId
      ) {
        return res.status(400).json({ message: 'Username is already in use' });
      }
      userToUpdate.username = username;
    }

    if (email) {
      // Check if the updated email is already in use
      const existingUserWithEmail = await User.findOne({ email });
      if (
        existingUserWithEmail &&
        existingUserWithEmail._id.toString() !== userId
      ) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      userToUpdate.email = email;
    }

    // Update password if a new password is provided
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      userToUpdate.password = hashedPassword;
    }

    // Save the updated user
    const updatedUser = await userToUpdate.save();

    res
      .status(200)
      .json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while updating the user' });
  }
};

// delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find and delete the user
    const deletedUser = await User.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update entries and comments associated with the deleted user
    await Entry.updateMany({ user: userId }, { $set: { user: 'deletedUser' } });
    await Comment.updateMany(
      { user: userId },
      { $set: { user: 'deletedUser' } }
    );

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json(error);
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
