const Entry = require('../models/Entry');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Tag = require('../models/Tag');

// create entry
async function createEntry(req, res) {
  try {
    const tagNames = req.body.tags; // tag names

    // find existing tags
    const existingTags = await Tag.find({ name: { $in: tagNames } });

    const existingTagNames = existingTags.map((tag) => tag.name);
    const newTagNames = tagNames.filter(
      (tagName) => !existingTagNames.includes(tagName)
    );

    // if tag exists, use their IDs
    const existingTagIds = existingTags.map((tag) => tag._id);

    // if tag doesn't exist, create new tag
    const newTagIds = [];
    if (newTagNames.length > 0) {
      const newTags = await Tag.create(newTagNames.map((name) => ({ name })));
      newTagIds.push(...newTags.map((tag) => tag._id));
    }

    // combine existing tag IDs and new tag IDs
    const entryTags = [...existingTagIds, ...newTagIds];

    const newEntry = await Entry.create({
      content: req.body.content,
      author: req.user._id,
      tags: entryTags,
    });

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// get all entries
async function getAllEntries(req, res) {
  try {
    const entries = await Entry.find().populate('author', 'username');
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// get all entries from user
async function getUserEntries(req, res) {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error(`User not found`);
    }

    // Find all entries from user
    const userEntries = await Entry.find({ author: userId })
      .populate('author', '-password')
      .populate('tags', 'name');

    res.status(200).json(userEntries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// get a entry
async function getAnEntry(req, res) {
  try {
    const entry = await Entry.findById(req.params.entryId)
      .populate('author', 'username')
      .populate('tags', 'name')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username' },
      });

    if (!entry) {
      res.status(404).json({ error: 'Entry not found' });
      return;
    }

    res.status(200).json(entry);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

// update entry
async function updateEntry(req, res) {
  try {
    const entry = await Entry.findById(req.params.entryId);

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (entry.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: 'This entry belongs to another user' });
    }

    entry.content = req.body.content;
    await entry.save();

    res.status(200).json({ message: 'Entry updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// delete entry
async function deleteEntry(req, res) {
  try {
    const entry = await Entry.findById(req.params.entryId);

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (entry.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: 'This entry belongs to another user' });
    }

    // delete all comments and likes of entry
    await Comment.deleteMany({ entry: entry._id });
    await Like.deleteMany({ entry: entry._id });
    
    await Entry.findByIdAndDelete(req.params.entryId);
    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createEntry,
  getAllEntries,
  getUserEntries,
  getAnEntry,
  updateEntry,
  deleteEntry,
};
