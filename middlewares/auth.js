const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors");

/**
 * Authentication Middleware
 *
 * Verifies the JWT token provided in the Authorization header.
 * If valid, attaches the payload to req.user and proceeds.
 * If invalid or missing, throws an UnauthorizedError.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if the Authorization header is present and starts with 'Bearer '
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  // Extract the token by removing 'Bearer ' prefix
  const token = authorization.replace("Bearer ", "");

  try {
    // Verify the token using the secret key
    const payload = jwt.verify(token, JWT_SECRET);

    // Attach the payload to req.user for use in downstream middleware/routes
    req.user = payload;

    // Proceed to the next middleware or route handler
    return next();
  } catch (err) {
    console.error("Authorization Error:", err.message);
    return next(new UnauthorizedError("Invalid token"));
  }
};

module.exports = auth;
