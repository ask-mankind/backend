const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, config.JWT_SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        console.error(err);
        res.status(401).json({ error: 'Unauthorized' });
      } else {
        const user = await User.findById(decodedToken.id);
        req.user = user; // Attach user information to the request
        next();
      }
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = { requireAuth };