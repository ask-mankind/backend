const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const entryRoutes = require('./routes/entryRoutes');

const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/entries', entryRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
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

port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
