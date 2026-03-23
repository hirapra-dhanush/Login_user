const jwt = require("jsonwebtoken");
const  ErrorHandler  = require("../utils/ErrorHandler");

exports.isAuth = (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return next(new ErrorHandler("Token required", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
};
