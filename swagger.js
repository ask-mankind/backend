const config = require('./config');

const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = [
  './routes/index.js',
  './routes/entriesRoutes.js',
  './routes/commentsRoutes.js',
  './routes/likesRoutes.js',
  './routes/usersRoutes.js',
  './routes/tagsRoutes.js',
];

const doc = {
  host: `localhost:${config.PORT}`,
};

swaggerAutogen(outputFile, endpointsFiles, doc);
