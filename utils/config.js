require("dotenv").config();

const { JWT_SECRET = "default_secret_key" } = process.env;

module.exports = {
  JWT_SECRET,
};
