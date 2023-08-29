const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');
const { requireAuth } = require('../middleware/authMiddleware');

// add comment to entry
router.post(
  '/:entryId/comment',
  requireAuth,
  commentsController.addCommentToEntry
);

// get all comments from entry
router.get('/:entryId/comments', commentsController.getAllCommentsfromEntry);

// update comment
router.put('/:entryId/comments/:commentId/update', requireAuth, commentsController.updateComment);

// delete comment
router.delete(
  '/:entryId/comments/:commentId/delete',
  requireAuth,
  commentsController.deleteComment
);

module.exports = router;
