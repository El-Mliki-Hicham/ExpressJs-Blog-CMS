const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseHandler');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer TOKEN"

  if (!token) {
    return errorResponse(res, 401, "Access denied. No token provided.")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    return errorResponse(res, 403, "Invalid or expired token..");
  }
};

module.exports = authenticate;
