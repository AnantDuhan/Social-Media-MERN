const app = require('./app');
const { connectDB } = require('./config/database');
require('dotenv').config({ path: 'backend/config/config.env' });

// Handling Uncaught Exceptions
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exceptions`);
    process.exit(1);
});

// connect DB
connectDB();

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