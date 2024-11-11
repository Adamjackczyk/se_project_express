/**
 * Centralized Error-Handling Middleware
 *
 * This middleware handles all errors that occur in the application.
 * It logs the error to the console and sends an appropriate response to the client.
 *
 * @param {Error} err - The error object.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err);

  const { statusCode = 500, message = "An error occurred on the server." } =
    err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server." : message,
  });
};

module.exports = errorHandler;
