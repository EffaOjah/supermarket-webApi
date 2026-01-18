require('dotenv').config();
const jwt = require('jsonwebtoken');

// Create JWT token
const createToken = (user) => {
    const payload = {
        userId: user.user_id,
        email: user.email,
        role: user.role,  // CRITICAL: Include role in token for authorization
        branch_id: user.branch_id,
        branch_name: user.branch_name
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
        return res.redirect('/admin/signin');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err);
            return res.redirect('/admin/signin');
        }
        req.user = decoded;
        res.locals.user = decoded; // Make user available in all templates
        next();
    });
}

// Check Role Middleware
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            console.log(`Access denied. User role: ${req.user ? req.user.role : 'none'}, Required: ${roles}`);
            req.flash('error_msg', 'Access denied. You do not have permission to view this page.');
            return res.redirect('/admin/dashboard'); // Redirect to a safe default or back
        }
        next();
    }
}

module.exports = {
    createToken,
    verifyToken,
    requireRole
};