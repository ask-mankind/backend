// const express = require('express');
// const router = express.Router();
// const commentsController = require('../controllers/commentsController');
// const likesController = require('../controllers/likesController');
// const { requireAuth } = require('../middleware/authMiddleware'); // Middleware'ı import edin

// // add comment to entry
// router.post(
//   '/:entryId/comment',
//   requireAuth,
//   commentsController.addCommentToEntry
// );

// // get all comments from entry
// router.get('/:entryId/comments', commentsController.getAllCommentsfromEntry);

// // update comment
// router.put('/:commentId/update', requireAuth, commentsController.updateComment);

// // delete comment
// router.delete(
//   '/:commentId/delete',
//   requireAuth,
//   commentsController.deleteComment
// );

// module.exports = router;
