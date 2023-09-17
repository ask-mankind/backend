const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Check if the Authorization header is present

  // The Authorization header should be in the format "Bearer tokenValue"
  const [authType, token] = authHeader.split(' ');

  // Check if the Authorization type is 'Bearer' and if a token exists
  if (authType !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Invalid Authorization header format' });
  }
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

module.exports = { requireAuth };