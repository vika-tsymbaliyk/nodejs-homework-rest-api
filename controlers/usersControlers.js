const fs = require('fs/promises');
const path = require("path");
const bcrypt = require('bcrypt');
const Jimp = require("jimp");
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const User = require('../models/users');
const controllerWrapper = require("../utils/decorators/controllerWrapper");
const { HttpError } = require('../utils/helpers/HttpErrors');

const {JWT_SECRET} = process.env;

const avatarPath = path.join(__dirname, "../", "public", "avatars");

const signup = async(req, res)=>{
    const { email, password} = req.body;

    const user = await User.findOne({ email });
    if (user) {
        throw new HttpError(409, 'Email in use');
    }

    const gravatarAvatarUrl = gravatar.url(email);

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, password: hashPassword, avatarURL: gravatarAvatarUrl})
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatarURL: newUser.avatarURL
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
        avatarURL: user.avatarURL
        },
    });
}

const getCurrent = async(req, res)=>{
    const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription
  });
}

const logout = async (req, res) => {
    const { _id } = req.user;
      const result = await User.findByIdAndUpdate(_id, { token: '' });
  
    if (!result) {
      throw new HttpError(404, 'Not found');
    }
    res.status(204).json({});
  };

  const updateAvatar = async(req,res)=>{
    const {_id: owner} = req.user;
    const {path: oldPath, filename} = req.file;
    const img = await Jimp.read(oldPath);
      await img.resize(250, 250).writeAsync(oldPath);
    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);

    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(owner, {avatarURL});
    console.log(oldPath);

    res.status(201).json({ avatarURL });

  }

module.exports = {
    signup: controllerWrapper(signup),
    signin: controllerWrapper(signin),
    getCurrent: controllerWrapper(getCurrent),
    logout: controllerWrapper(logout),
    updateAvatar: controllerWrapper(updateAvatar)
}