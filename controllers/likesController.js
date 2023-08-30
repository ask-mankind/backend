const Like = require('../models/Like');
const Entry = require('../models/Entry');
const Comment = require('../models/Comment');

// like entry
async function likeEntry(req, res) {
  try {
    const entryId = req.params.entryId;
    const userId = req.user._id;

    const entry = await Entry.findById(entryId);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    // check if user already liked this entry
    const existingLike = await Like.findOne({ user: userId, entry: entryId });

    if (existingLike) {
      return res
        .status(400)
        .json({ error: 'This user already liked this entry' });
    }

    const newLike = await Like.create({
      user: userId,
      entry: entryId,
    });

    await Entry.findByIdAndUpdate(entryId, {
      $push: { likes: newLike._id },
    });

    res.status(201).json(newLike);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// like comment
async function likeComment(req, res) {
  try {
    const commentId = req.params.commentId;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
   
    // check if user already liked this comment
    const existingLike = await Like.findOne({
      user: userId,
      comment: commentId,
    });

    if (existingLike) {
      return res
        .status(400)
        .json({ error: 'This user already liked this comment' });
    }

    const newLike = await Like.create({
      user: userId,
      comment: commentId,
    });

    await Comment.findByIdAndUpdate(commentId, {
      $push: { likes: newLike._id },
    });

    res.status(201).json(newLike);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// unlike entry
async function unlikeEntry(req, res) {
  try {
    const like = await Like.findOneAndDelete({
      user: req.user._id,
      entry: req.params.entryId,
    });

    if (!like) {
      return res.status(404).json({ error: 'Like not found' });
    }

    if (like) {
      await Entry.findByIdAndUpdate(req.params.entryId, {
        $pull: { likes: like._id },
      });

      res.status(200).json({ message: 'Entry unliked' });
    } else {
      res.status(404).json({ message: 'Like not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// unlike comment
async function unlikeComment(req, res) {
  try {
    const like = await Like.findOneAndDelete({
      user: req.user._id,
      comment: req.params.commentId,
    });

    if (!like) {
      return res.status(404).json({ error: 'Like not found' });
    }

    if (like) {
      await Comment.findByIdAndUpdate(req.params.commentId, {
        $pull: { likes: like._id },
      });

      res.status(200).json({ message: 'Comment unliked' });
    } else {
      res.status(404).json({ message: 'Like not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// get all likes from entry
async function getAllLikesFromEntry(req, res) {
  try {
    const entryLikes = await Like.find({ entry: req.params.entryId });
    res.status(200).json(entryLikes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// get all likes from comment
async function getAllLikesFromComment(req, res) {
  try {
    const commentLikes = await Like.find({ comment: req.params.commentId });
    res.status(200).json(commentLikes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  likeEntry,
  likeComment,
  unlikeEntry,
  unlikeComment,
  getAllLikesFromEntry,
  getAllLikesFromComment,
};
