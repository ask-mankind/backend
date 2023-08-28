const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      maxlength: [50, 'Username cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: [50, 'Email cannot be more than 50 characters'],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password cannot be less than 6 characters'],
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
