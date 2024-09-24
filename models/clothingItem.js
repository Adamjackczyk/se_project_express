const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Item name is required"],
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: [true, "Weather type is required"],
    enum: ["hot", "warm", "cold"],
    // default: "hot",
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required"],
    validate: {
      validator: (url) => validator.isURL(url),
      message: "You must enter a valid URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user",
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItem", clothingItemSchema);
