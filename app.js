const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(
    'mongodb+srv://gem007bd:'+ 
    process.env.MONGO_ATLAS_PW +
    '@cluster0-inwg1.mongodb.net/test?retryWrites=true',
    {
        useNewUrlParser: true
    }
);

mongoose.Promise = global.Promise;

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user'); 

app.use(morgan('dev'));
// make upload file to everyone
app.use('/uploads', express.static('uploads'));
/**
 * parsing the body
 */
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

// Handling Cross-Origin Resource Sharing(CROS) Errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin,  X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
            );
        return res.status.json({});
    }
    next();
});

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;