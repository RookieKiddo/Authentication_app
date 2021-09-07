const ErrorReponse = require('../utils/errorResponse.js');

const errorHandler = (err, req, res, next) => {
    let error = {
        ...err
    };

    error.message = err.message


    if (err.code === 11000) {
        const message = `Duplicate Field Value Enter`;
        error = new ErrorReponse(message, 400);
    }

    if (err.name === "ValidationError") {
        const message = Object.values(err.error).map((val) => val.message);
        error = new ErrorReponse(message, 400);
    }

    res.status(error.statusCode || 500).json({ 
        sucess: false,
        error: error.message || "Server Error"
    });
}

module.exports = errorHandler;