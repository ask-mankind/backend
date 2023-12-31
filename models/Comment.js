const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  entry: { type: mongoose.Schema.Types.ObjectId, ref: 'Entry', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }],
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
