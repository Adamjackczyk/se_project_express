/**
 * BadRequestError Class
 *
 * Represents an HTTP 400 Bad Request error.
 */
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = "BadRequestError";
  }
}

module.exports = BadRequestError;
