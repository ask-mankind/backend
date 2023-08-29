const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    tags: {
      type: [String], // Array of strings for tags
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Entry', EntrySchema);
