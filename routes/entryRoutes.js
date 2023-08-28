const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController');
const { requireAuth } = require('../middlewares/auth');

// Create a new entry
router.post('/', requireAuth, entryController.createEntry);

// Add a comment to an entry
router.post('/:entryId/comments', requireAuth, entryController.addComment);

// Like an entry
router.post('/:entryId/likes', requireAuth, entryController.likeEntry);

// Get all entries
router.get('/', entryController.getAllEntries);

// Get all comments from an entry
router.get('/:entryId/comments', entryController.getAllComments);

module.exports = router;
