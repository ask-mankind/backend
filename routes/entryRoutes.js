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

// Get an entry
router.get('/:entryId', entryController.getAEntry);

// Get all comments from an entry
router.get('/:entryId/comments', entryController.getAllComments);

// Get all likes from an entry
router.get('/:entryId/likes', entryController.getEntryLikes);

// Update an entry (protected route)
router.patch('/:entryId', requireAuth, entryController.updateEntry);

// Delete an entry (protected route)
router.delete('/:entryId', requireAuth, entryController.deleteEntry);



module.exports = router;
