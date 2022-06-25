const app = require('./app');
const { connectDB } = require('./config/database');
require('dotenv').config({ path: 'backend/config/config.env' });

// connect DB
connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on localhost:${process.env.PORT}`);
})