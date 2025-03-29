const User = require('../models/user.models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

exports.register = async (req, res)=> {
    const {username, password} = req.body;
    try {
        let user = await User.findOne({username})
        if(user) return res.status(400).json({msg : 'User already exists'});
        user = new User({username, password});
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const payload = {id : user.id};
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn : 3600}, (err, token) => {
            if (err) throw err;
            res.json({token});
        })
    } catch (error) {
        res.status(500).send('server error');
    }
};

exports.login = async (req, res) => {
    const {username, password} = req.body;
    try {
        let user = await User.findOne({username});
        if(!user) return res.status(400).json({msg : 'Invalid credentials'});
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({msg : "Invalid credentials"});
        const payload = {id : user.id};
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : 3600}, (err, token) => {
            if(err) throw err;
            res.json({token});
        });
    } catch (error) {
        return res.status(500).send('Server error');
    }
}