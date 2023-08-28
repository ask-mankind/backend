const Entry = require('../models/Entry');
const Comment = require('../models/Comment');
const Like = require('../models/Like');

// Create a new entry
exports.createEntry = async (req, res) => {
  try {
    const { content, tags } = req.body;
    const userId = req.user.id; // Assuming user information is attached to the request

    if (!content || !Array.isArray(tags) || tags.length > 3) {
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
    const { content, user } = req.body;
    const entryId = req.params.entryId;

    if (!content || !user) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const newComment = new Comment({
      content,
      user,
    });

    await newComment.save();

    const entry = await Entry.findByIdAndUpdate(
      entryId,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    res.status(200).json({ message: 'Comment added to the entry', entry });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while adding the comment', error });
  }
};

// Like an entry
exports.likeEntry = async (req, res) => {
  try {
    const entryId = req.params.entryId;
    const userId = req.body.user; // Assuming you get the user's ID from authentication

    const newLike = new Like({
      user: userId,
    });

    await newLike.save();

    const entry = await Entry.findByIdAndUpdate(
      entryId,
      { $push: { likes: newLike._id } },
      { new: true }
    );

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