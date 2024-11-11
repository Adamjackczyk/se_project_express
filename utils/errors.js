const BadRequestError = require("../middlewares/errors/bad-request-err");
const UnauthorizedError = require("../middlewares/errors/unauthorized-err");
const ForbiddenError = require("../middlewares/errors/forbidden-err");
const NotFoundError = require("../middlewares/errors/not-found-err");
const ConflictError = require("../middlewares/errors/conflict-err");
const InternalServerError = require("../middlewares/errors/internal-server-err");

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};
