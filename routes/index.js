const express = require('express');
const router = express.Router();

// Routes
router.use(
  '/api/entries',
  require('./entriesRoutes'),
  require('./commentsRoutes'),
  require('./likesRoutes')
);
router.use('/api/users', require('./usersRoutes'));
router.use('/api/tags', require('./tagsRoutes'));

// healthcheck
router.get('/healthcheck', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

module.exports = router;
