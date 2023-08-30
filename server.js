const express = require('express');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const cookieParser = require('cookie-parser');
const cors = require('cors');

const config = require('./config');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Swagger
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/', require('./routes/index'));

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
