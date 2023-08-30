if (process.env.NODE_ENV != 'production' && process.env.NODE_ENV != 'development') {
    console.log('NODE_ENV is not set to prod or dev. Setting it to dev');
    process.env.NODE_ENV = 'development';
}

require('dotenv').config({ path: `.env` })

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports = {
    MONGO_URI,
    PORT,
    JWT_SECRET_KEY
};