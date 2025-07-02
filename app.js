require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

const db = require('./config/dbConfig');
const authRoute = require('./routes/authRoute');
const adminRoute = require('./routes/adminRoutes');
const branchRoute = require('./routes/branchRoutes');
const dataRoute = require('./routes/dataRoutes');

db.connect((err) => {
    if (err) {
        console.log('Database connection failed: ', err);
    } else {
        console.log('Database connection successfully');
    }
});

const app = express();

const cors = require('cors');

// Allow requests from your frontend's origin
const corsOptions = {
    origin: '*',  // Your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],         // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Add any headers you need
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');

// Set app to use static files
app.use(express.static('public'));

// Set app to use json
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Custom middleware to pass flash messages to views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Set app to use cookie parser
app.use(cookieParser());

// Home route
app.get('/', (req, res) => {
    res.redirect('/admin/signin');
});



// Use external routes
app.use(authRoute);
app.use(adminRoute);
app.use(branchRoute);
app.use(dataRoute);

app.listen(PORT, () => {
    console.log(`Stores WEB API Server is running on PORT ${PORT}`);
});
