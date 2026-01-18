// Middleware to protect routes based on user role
const jwt = require('jsonwebtoken');

const requireRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            // Get token from cookie
            const token = req.cookies.mbAuthToken;

            if (!token) {
                req.flash('error_msg', 'Please login to access this page');
                return res.redirect('/admin/signin');
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if user role is allowed
            if (!allowedRoles.includes(decoded.role)) {
                req.flash('error_msg', 'Unauthorized access');
                return res.redirect('/admin/signin');
            }

            // Attach user to request
            req.user = decoded;
            res.locals.user = decoded; // Add this for template access
            next();
        } catch (error) {
            console.error('Auth error:', error);
            req.flash('error_msg', 'Invalid session. Please login again.');
            return res.redirect('/admin/signin');
        }
    };
};

module.exports = { requireRole };
