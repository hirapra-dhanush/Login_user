

const ErrorMiddle = (err, req, res, next) => {
    err.message = err.message || "internal error";
    err.statusCode = err.statusCode || 500;

    if (err.code === 11000) {
        const statusCode = 400;
        const message = "Duplicate field value entered";
        err = new ErrorHandler(message, statusCode);
    }
    if (err.name === "JsonWebTokenError") {
        const statusCode = 400;
        const message = "JSON Web Token is invalid try again";
        err = new ErrorHandler(message, statusCode);
    }
    if (err.name === "TokenExpiredError") {
        const statusCode = 400;
        const message = "JSON Web Token is Expired try again";
        err = new ErrorHandler(message, statusCode);
    }
    if (err.name === "CastError") {
        const statusCode = 400;
        const message = `Resource not found Invalid:${err.path}`;
        err = new ErrorHandler(message, statusCode);
    }

    const errormessage = err.errors ? Object.values(err.errors).map(error => error.message).join(" ") : err.message

    return res.status(err.statusCode).json({
        success: false,
        message: errormessage,

    })

}

module.exports =  ErrorMiddle  ;