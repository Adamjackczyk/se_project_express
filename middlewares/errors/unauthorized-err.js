/**
 * UnauthorizedError Class
 *
 * Represents an HTTP 401 Unauthorized error.
 */
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = "UnauthorizedError";
  }
}

module.exports = UnauthorizedError;
