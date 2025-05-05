require('dotenv').config();
const jwt = require('jsonwebtoken');

// Create JWT token
const createToken = (user) => {
    const payload = {
        userId: user.user_id,
    };

    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('Error creating token:', err);
                return reject(err);
            }
            resolve(token);
        });
    });
}

// Verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.cookies.mbAuthToken;

    if (!token) {
        console.log('No token provided');
        return res.redirect('/auth/signin');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err);
            return res.redirect('/auth/signin');
        }
        req.user = decoded;
        next();
    });
}

module.exports = {
    createToken,
    verifyToken,
};