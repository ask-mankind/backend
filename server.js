const express = require('express');
const cookieParser = require('cookie-parser');

const config = require('./config');
const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/entry', require('./routes/entriesRoutes'), require('./routes/commentsRoutes'), require('./routes/likesRoutes'));
app.use('/api/user', require('./routes/usersRoutes'));


// Handle 404 errors
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist',
  });
});

// Connect to MongoDB
connectDB();

// Start server
const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));