const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

dotenv.config()


const app = express();

app.use('/api/users', (req, res) => {
  res.send('Hello World!');
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist',
  });
});

connectDB();

port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
