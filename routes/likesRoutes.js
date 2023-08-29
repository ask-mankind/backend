// const express = require('express');
// const router = express.Router();
// const likesController = require('../controllers/likesController');
// const { requireAuth } = require('../middleware/authMiddleware'); // Middleware'ı import edin

// // like entry
// router.post('/entry/:entryId/like', requireAuth, likesController.likeEntry);

// // like comment
// router.post(
//   '/comment/:commentId/like',
//   requireAuth,
//   likesController.likeComment
// );

// // unlike entry
// router.post('/entry/:entryId/unlike', requireAuth, likesController.unlikeEntry);

// // unlike comment
// router.post(
//   '/comment/:commentId/unlike',
//   requireAuth,
//   likesController.unlikeComment
// );

// // get all likes from entry
// router.get('/entry/:entryId/likes', likesController.getAllLikesFromEntry);

// // get all likes from comment
// router.get('/comment/:commentId/likes', likesController.getAllLikesFromComment);

// module.exports = router;
