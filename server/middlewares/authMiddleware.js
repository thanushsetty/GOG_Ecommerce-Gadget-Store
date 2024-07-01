const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = 'jwt_secret_key';
const userAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    // console.log("dd",req.user);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Unauthorized: Invalid token' });
        }
        req.user = user;
        next();
    });
};

module.exports = userAuth;