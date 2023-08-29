const Entry = require('../models/Entry');
const Comment = require('../models/Comment');
const Like = require('../models/Like');

// Create a new entry
exports.createEntry = async (req, res) => {
  try {
    const { content, tags } = req.body;
    const userId = req.user.id; // Assuming user information is attached to the request

    if (!content) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const newEntry = new Entry({
      content,
      user: userId,
      tags,
    });

    await newEntry.save();

    res
      .status(201)
      .json({ message: 'Entry created successfully', entry: newEntry });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while creating the entry', error });
  }
};

// Add a comment to an entry
exports.addComment = async (req, res) => {
  try {
    const { comment, userId } = req.body;
    const entryId = req.params.entryId;

    if (!comment || !userId) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    console.log('qweqwewq');

    const newComment = new Comment({
      comment,
      userId,
    });

    await newComment.save();
    const entry = await Entry.findByIdAndUpdate(
      entryId,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    res.status(200).json({ message: 'Comment added to the entry', entry });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Like an entry
exports.likeEntry = async (req, res) => {
  try {
    const { userId } = req.body;

    const entryId = req.params.entryId;
    // Check if the entry exists
    const entry = await Entry.findById(entryId);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Check if the user has already liked the entry
    const hasLiked = entry.likes.some(like => like.user.equals(userId));

    if (hasLiked) {
      return res.status(400).json({ message: 'User has already liked this entry' });
    }

    // Add the user's like to the entry
    entry.likes.push({ user: userId });
    await entry.save();

    res.status(200).json({ message: 'Entry liked', entry });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while liking the entry', error });
  }
};

// Get all entries
exports.getAllEntries = async (req, res) => {
  try {
    const entries = await Entry.find().populate('comments likes');

    if (!entries) return res.status(404).send('Entries not found');

    res.status(200).json(entries);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while retrieving entries', error });
  }
};

// Get all comments from an entry
exports.getAllComments = async (req, res) => {
  try {
    const entryId = req.params.entryId;
    const entry = await Entry.findById(entryId).populate('comments');
    res.status(200).json(entry.comments);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while retrieving comments', error });
  }
};

exports.getAEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.entryId);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found',
      });
    }

    res.status(200).json({
      success: true,
      entry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getEntryLikes = async (req, res) => {
  try {
    const entryId = req.params.id;

    // Find the entry by ID
    const entry = await Entry.findById(entryId);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    const likes = entry.likes;

    res.status(200).json({ likes });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching likes' });
  }
};

exports.updateEntry = async (req, res) => {
  try {
    const entryId = req.params.id;
    const { content, tags } = req.body;

    // Find the entry by ID
    const entryToUpdate = await Entry.findById(entryId);

    if (!entryToUpdate) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Update entry information if provided
    if (content) {
      entryToUpdate.content = content;
    }

    if (tags) {
      entryToUpdate.tags = tags;
    }

    // Save the updated entry
    const updatedEntry = await entryToUpdate.save();

    res
      .status(200)
      .json({ message: 'Entry updated successfully', entry: updatedEntry });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while updating the entry' });
  }
};

exports.deleteEntry = async (req, res) => {
  try {
    const entryId = req.params.id;

    // Find and delete the entry
    const deletedEntry = await Entry.findOneAndDelete({ _id: entryId });

    if (!deletedEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Delete associated comments
    await Comment.deleteMany({ entry: entryId });

    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the entry' });
  }
};
