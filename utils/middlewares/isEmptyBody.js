const { HttpError } = require("../helpers/httpErrors");

const isEmptyBody = async(req, res, next)=> {
    const keys = Object.keys(req.body);
    if (!keys.length) {
        return next( HttpError(400, "Missing fields") )
    }
    next();
}

module.exports = isEmptyBody;