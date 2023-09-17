const Entry = require('../models/Entry');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Tag = require('../models/Tag');

// create entry
async function createEntry(req, res) {
  try {
    const tagNames = req.body.tags;
    
    const newEntry = await Entry.create({
      content: req.body.content,
      author: req.user._id,
      tags: [],
    });

    for (const tagName of tagNames) {
      let existingTag = await Tag.findOne({ name: tagName });

      if (existingTag) {
        if (!existingTag.entries.includes(newEntry._id)) {
          existingTag.entries.push(newEntry._id);
          await existingTag.save();
        }
      } else {
        existingTag = await Tag.create({
          name: tagName,
          entries: [newEntry._id],
          count: 1,
        });
      }

      newEntry.tags.push(existingTag._id);
    }

    await newEntry.save();

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// get all entries
async function getAllEntries(req, res) {
  try {
    const entries = await Entry.find()
      .populate('author', 'username')
      .populate('tags', 'name')
      .populate({
        path: 'comments',
        populate: { path: 'author'},
        populate: { path: 'likes' },
      });
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

    // get all comments of the entry
    const comments = await Comment.find({ entry: entry._id });

    // delete all comments' likes
    for (const comment of comments) {
      await Like.deleteMany({ comment: comment._id });
    }

    // Delete all comments and likes of entry
    await Comment.deleteMany({ entry: entry._id });
    await Like.deleteMany({ entry: entry._id });

    // Find tags associated with this entry
    const tags = await Tag.find({ entries: entry._id });

    // Check if each tag has entries other than the one being deleted
    for (const tag of tags) {
      const otherEntriesWithTag = await Entry.exists({
        _id: { $ne: entry._id },
        tags: tag._id,
      });

      if (!otherEntriesWithTag) {
        await Tag.findByIdAndDelete(tag._id);
      } else {
        tag.entries = tag.entries.filter(
          (id) => id.toString() !== entry._id.toString()
        );
        await tag.save();
      }
    }

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
  deleteEntry,
};
