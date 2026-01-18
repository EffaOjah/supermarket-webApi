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
    const { email, password, role } = req.body;
    console.log(req.body);


    // Check if all details were provided
    if (!email || !password || !role) {
        console.log('Incomplete login details');
        req.flash('error_msg', 'Please provide email, password, and select a role');
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
        console.log('User found:', { email: user.email, role: user.role });
        console.log('Selected role:', role);

        // Check if password is correct 
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Invalid password');
            req.flash('error_msg', 'Invalid password');
            return res.redirect('/admin/signin');
        }

        // Validate that user has permission for selected role
        console.log('Checking role match - User role:', user.role, 'Selected role:', role);
        if (user.role !== role) {
            console.log('Role mismatch - User has role:', user.role, 'but selected:', role);
            req.flash('error_msg', 'You do not have permission to access this role');
            return res.redirect('/admin/signin');
        }

        // If login is successful, create a JWT token
        const token = await jwt.createToken(user);
        console.log('Token created:', token);

        // Set the token in a cookie
        res.cookie('mbAuthToken', token);

        req.flash('success_msg', 'Login successful');

        // Role-based redirect based on selected role
        switch (role) {
            case 'admin':
                return res.redirect('/admin/dashboard');
            case 'accountant':
                return res.redirect('/accountant/dashboard');
            case 'operations':
                return res.redirect('/operations/dashboard');
            case 'warehouse':
                return res.redirect('/warehouse/dashboard');
            case 'pko':
                return res.redirect('/pko/dashboard');
            default:
                req.flash('error_msg', 'Invalid role selected');
                return res.redirect('/admin/signin');
        }
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