const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const controllerWrapper = require("../utils/decorators/controllerWrapper");
const { HttpError } = require('../utils/helpers/HttpErrors');

const {JWT_SECRET} = process.env;

const signup = async(req, res)=>{
    const { email, password} = req.body;

    const user = await User.findOne({ email });
    if (user) {
        throw new HttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, password: hashPassword})
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }
    })
}

const signin = async(req,res)=>{
    const { email, password} = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new HttpError(401, 'Email or password is wrong');
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw new HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
        token: token,
        user: {
        email: user.email,
        subscription: user.subscription,
        },
    });
}

module.exports = {
    signup: controllerWrapper(signup),
    signin: controllerWrapper(signin),
}