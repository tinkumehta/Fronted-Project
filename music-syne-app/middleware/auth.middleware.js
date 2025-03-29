const jwt = require('jsonwebtoken');
const User = require('../models/user.models');

const auth = async (req, res, next) => {
    const token = req.header('Authorization');
    if(!token) return res.status(401).json({msg : "No token, authorization"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        res.status(401).json({msg : 'Token is not valid'});
    }
}

module.exports = auth;