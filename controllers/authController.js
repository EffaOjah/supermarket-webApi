// File: controllers/authController.js
const bcrypt = require('bcrypt');

// Require JWT middleware
const jwt = require('../middleware/jwt');

// User Model
const userModel = require('../models/userModel');

const signinGet = (req, res) => {
    res.render('signin');
};

const register = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the user
        const createUser = await userModel.createUser(email, username, hashedPassword);
        console.log(createUser);

        return res.status(200).json({ createUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }

}

const login = async (req, res) => {
    const { email, password } = req.body;

    // Check if all details were provided
    if (!email || !password) {
        console.log('Incomplete login details');
        res.status(400).json({ message: 'Please provide all details' });
    }

    try {
        // Check if email is correct
        const checkUser = await userModel.findUserByEmail(email);
        console.log(checkUser);

        if (checkUser.length === 0) {
            console.log('Email not found');            
            return res.status(400).json({ message: 'Email not found' });
        }

        let user = checkUser[0];
        // Check if password is correct 

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(400).json({ message: 'Invalid password' });
        }

        // If login is successful, create a JWT token
        const token = await jwt.createToken(user);
        console.log('Token created:', token);

        // Set the token in a cookie
        res.cookie('mbAuthToken', token);

        // Redirect to the dashboard
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }

}

module.exports = { signinGet, login };
