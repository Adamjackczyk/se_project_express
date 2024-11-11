/**
 * InternalServerError Class
 *
 * Represents an HTTP 500 Internal Server Error.
 */
class InternalServerError extends Error {
  constructor(message = "An error occurred on the server.") {
    super(message);
    this.statusCode = 500;
    this.name = "InternalServerError";
  }
}

module.exports = InternalServerError;
