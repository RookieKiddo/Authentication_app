const jwt = require('jsonwebtoken');
const User = require('../models/Users.js');
const ErrorReponse = require('../utils/errorResponse.js');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        // Bearer and Json Web Token
        // Bearer 3131249sdjpfsjdf
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new ErrorReponse("Not Authorized to access this route"), 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if(!user){
            return next(new ErrorReponse("Not User Found with this ID"), 404);
        }

        req.user = user;

        next();

    } catch (error) {
        return next(new ErrorReponse("Not authorized to access this route", 401));
    }
}