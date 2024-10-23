const checkAdmin = (req, res, next) => {
    // Assuming `req.user` is populated by `authenticateToken` middleware
    if (req.user && req.user.role === 'admin') {
        next();  // User is admin, allow access to route
    } else {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
};

module.exports = checkAdmin;
