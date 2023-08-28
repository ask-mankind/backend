const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Tag', TagSchema);
