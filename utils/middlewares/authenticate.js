const jwt = require('jsonwebtoken');
const controllerWrapper = require('../decorators/controllerWrapper');
const User = require('../../models/users');
const { HttpError } = require('../helpers/HttpErrors');

const {JWT_SECRET} = process.env;

const authenticate = async(req, res, next) => {
    const { authorization } = req.headers;
  if (!authorization) {
    throw new HttpError(401, "Authorization header not found");
}

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    throw new HttpError(401, 'Not authorized');
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || user.token !== token || !user.token) {
      next(new HttpError(401, 'Not authorized'));
    }
    req.user = user;
    next();
  } catch {
    throw new HttpError(401, 'Not authorized');
  }
}

module.exports = controllerWrapper(authenticate)