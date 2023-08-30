const Tag = require('../models/Tag');
const Entry = require('../models/Entry');

// Get all tags
async function getAllTags(req, res) {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get all entries associated with a tag
async function getAllEntriesFromTag(req, res) {
  try {
    const tagId = req.params.tagId;

    // Find the tag
    const tag = await Tag.findOne({ _id: tagId });
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    // Get entries associated with the tag
    const entries = await Entry.find({ tags: tag._id }).populate('author', 'username');
    res.status(200).json(entries);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getAllTags,
  getAllEntriesFromTag,
};
