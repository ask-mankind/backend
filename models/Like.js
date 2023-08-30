const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entry: { type: mongoose.Schema.Types.ObjectId, ref: 'Entry' },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
