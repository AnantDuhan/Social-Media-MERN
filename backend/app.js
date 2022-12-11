const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fileupload = require('express-fileupload'); 

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: 'backend/config/config.env' });
}

// using middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));
app.use(express.json({ limit: '50mb' }));
app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: '50mb',
        parameterLimit: 50000,
    })
);
app.use(fileupload({ useTempFiles: true }));

// importing routes 
const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/userRoute');

// using routes
app.use('/api/v1', postRoute);
app.use('/api/v1', userRoute);

// CORS
app.use(async (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', '*');
    return next();
});

app.get('/', (req, res) => {
    res.send('Server is working');
});

module.exports = app;
