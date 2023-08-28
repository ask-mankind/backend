const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController');

router.post('/entries', entryController.createEntry);
router.post('/entries/:entryId/comments', entryController.addComment);
router.post('/entries/:entryId/likes', entryController.likeEntry);
router.get('/entries', entryController.getAllEntries);
router.get('/entries/:entryId/comments', entryController.getAllComments);

module.exports = router;
