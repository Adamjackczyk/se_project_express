const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if the Authorization header is present and starts with 'Bearer '
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  // Extract the token by removing 'Bearer ' prefix
  const token = authorization.replace("Bearer ", "");

  try {
    // Verify the token using the secret key
    const payload = jwt.verify(token, JWT_SECRET);

    // Attach the payload to req.user for use in downstream middleware/routes
    req.user = payload;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Authorization Error:", err.message);
    return res.status(UNAUTHORIZED).send({ message: "Invalid token" });
  }
};

module.exports = auth;
