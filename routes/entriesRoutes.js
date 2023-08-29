// const express = require('express');
// const router = express.Router();
// const entriesController = require('../controllers/entriesController');
// const likesController = require('../controllers/likesController');
// const { requireAuth } = require('../middleware/authMiddleware'); // Middleware'ı import edin

// // create entry
// router.post('/create', requireAuth, entriesController.createEntry);

// // like entry
// router.post('/:entryId/like', requireAuth, likesController.likeEntry);

// // get all entries
// router.get('/all', entriesController.getAllEntries);

// // get a entry
// router.get('/:entryId', entriesController.getAEntry);

// // update entry
// router.put('/:entryId/update', requireAuth, entriesController.updateEntry);

// // delete entry
// router.delete('/:entryId/delete', requireAuth, entriesController.deleteEntry);

// module.exports = router;
