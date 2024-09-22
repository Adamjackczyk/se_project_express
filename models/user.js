const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: [true, "The avatar must be a valid URL"],
    validate: {
      validator: (url) => validator.isURL(url),
    },
  },
});

module.exports = mongoose.model("user", userSchema);
