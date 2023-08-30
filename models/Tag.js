const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  entries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Entry' }],
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
