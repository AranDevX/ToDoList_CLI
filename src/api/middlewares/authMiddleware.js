const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'supersecretkey';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing or invalid' });
    }

    try {
        // Verify the token
        const user = jwt.verify(token, secretKey);
        req.user = user; // Attach the user info to the request object
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateToken;
