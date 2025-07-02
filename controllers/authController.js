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
        req.flash('error_msg', 'Incomplete login details');
        return res.redirect('/admin/signin');
    }

    try {
        // Check if email is correct
        const checkUser = await userModel.findUserByEmail(email);
        console.log(checkUser);

        if (checkUser.length === 0) {
            console.log('Email not found');
            req.flash('error_msg', 'Email not found');
            return res.redirect('/admin/signin');
        }

        let user = checkUser[0];
        // Check if password is correct 

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid password');
            req.flash('error_msg', 'Invalid password');
            return res.redirect('/admin/signin');
        }

        // If login is successful, create a JWT token
        const token = await jwt.createToken(user);
        console.log('Token created:', token);

        // Set the token in a cookie
        res.cookie('mbAuthToken', token);

        req.flash('success_msg', 'Login successful');
        // Redirect to the dashboard
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'An error occurred');
        return res.redirect('/admin/signin');
    }

}

const logout = async (req, res) => {
    res.cookie('mbAuthToken', '');

    req.flash('success_msg', 'Logout successful');
    res.redirect('/admin/signin');
}
module.exports = { signinGet, login, logout };