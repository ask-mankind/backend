const express = require('express');
const router = express.Router();
const entriesController = require('../controllers/entriesController');
const { requireAuth } = require('../middleware/authMiddleware'); // Middleware'ı import edin

// create entry
router.post('/', requireAuth, entriesController.createEntry);

// get all entries
router.get('/', entriesController.getAllEntries);

// get all entries from user
router.get('/:userId/entries', entriesController.getUserEntries);

// get a entry
router.get('/:entryId', entriesController.getAnEntry);

// update entry
router.put('/:entryId/update', requireAuth, entriesController.updateEntry);

// delete entry
router.delete('/:entryId/delete', requireAuth, entriesController.deleteEntry);

module.exports = router;
