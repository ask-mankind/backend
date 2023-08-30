const express = require('express');
const tagsController = require('../controllers/tagsController');

const router = express.Router();

// Get all tags
router.get('/', tagsController.getAllTags);

// Get all entries associated with a tag
router.get('/:tagId/entries', tagsController.getAllEntriesFromTag);

module.exports = router;
