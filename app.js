require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const db = require('./config/dbConfig');
const authRoute = require('./routes/authRoute');
const adminRoute = require('./routes/adminRoutes');
const branchRoute = require('./routes/branchRoutes');

db.connect((err) => {
    if (err) {
        console.log('Database connection failed: ', err);
    } else {
        console.log('Database connection successfully');
    }
});

const app = express();

const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');

// Set app to use static files
app.use(express.static('public'));

// Set app to use json
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

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

app.listen(PORT, () => {
    console.log(`Stores WEB API Server is running on PORT ${PORT}`);
});
