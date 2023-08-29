const Comment = require('../models/Comment');
const Entry = require('../models/Entry');

// add comment to entry
async function addCommentToEntry(req, res) {
  const entry = await Entry.findById(req.params.entryId);
  if (!entry) {
    return res.status(404).json({ message: 'Entry not found' });
  }

  try {
    const newComment = await Comment.create({
      comment: req.body.comment,
      author: req.user._id,
    });

    await Entry.findByIdAndUpdate(req.params.entryId, {
      $push: { comments: newComment._id },
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// get all comments from entry
async function getAllCommentsfromEntry(req, res) {
  try {
    const entry = await Entry.findById(req.params.entryId).populate('comments');
    if (!entry) {
      return res.status(404).json({ message: 'Entry bulunamadı' });
    }
    res.status(200).json(entry.comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// update comment
async function updateComment(req, res) {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      throw new Error(`Comment not found`);
    }
    const entry = await Entry.findById(req.params.entryId);
    if (!entry) {
      throw new Error(`Entry not found`);
    }
    if (comment.author.toString() !== req.user._id.toString()) {
      throw new Error(`You cannot update this comment`);
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      req.body,
      { new: true }
    );
    entry.comments = entry.comments.filter((id) => id !== updatedComment._id);
    updatedComment.entry = entry._id;
    await updatedComment.save();
    await entry.save();
    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// delete comment
async function deleteComment(req, res) {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      throw new Error(`Comment not found`);
    }
    const entry = await Entry.findById(req.params.entryId);
    if (!entry) {
      throw new Error(`Entry not found`);
    }
    if (comment.author.toString() !== req.user._id.toString()) {
      throw new Error(`You cannot delete this comment`);
    }
    await Comment.findByIdAndRemove(req.params.commentId);
    entry.comments = entry.comments.filter((id) => id !== comment._id);
    await entry.save();
    res.status(200).json({ message: `Comment deleted successfully` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  addCommentToEntry,
  getAllCommentsfromEntry,
  updateComment,
  deleteComment,
};
