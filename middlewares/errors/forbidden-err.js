/**
 * ForbiddenError Class
 *
 * Represents an HTTP 403 Forbidden error.
 */
class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = "ForbiddenError";
  }
}

module.exports = ForbiddenError;
