const express = require('express');
const cookieParser = require('cookie-parser');

const config = require('./config');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/entry', require('./routes/entriesRoutes'));
app.use('/api/user', require('./routes/usersRoutes'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

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