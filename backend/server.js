const app = require('./app');
const { connectDB } = require('./config/database');
const cloudinary = require('cloudinary');
require('dotenv').config({ path: 'backend/config/config.env' });

// Handling Uncaught Exceptions
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exceptions`);
    process.exit(1);
});

// connect DB
connectDB();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on localhost:${process.env.PORT}`);
});

// Unhandeled Promise Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(() => {
        process.exit(1);
    });
});