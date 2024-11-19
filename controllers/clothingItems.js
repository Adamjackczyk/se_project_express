// controllers/clothingItems.js

const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  InternalServerError,
} = require("../utils/errors");

/**
 * Get all clothing items
 */
const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find(); // Removed .populate("owner", "name avatar")
    res.status(200).send(items);
  } catch (err) {
    console.error(err);
    next(new InternalServerError());
  }
};

/**
 * Controller to create a new clothing item
 */
const createItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;

    const clothingItem = new ClothingItem({
      name,
      weather,
      imageUrl,
      owner: req.user._id.toString(), // Assign owner as string (user ID)
    });
    await clothingItem.save();

    res.status(201).send(clothingItem);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
    next(new InternalServerError());
  }
};

/**
 * Controller to delete a clothing item by ID
 */
const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      console.log("Invalid item ID format:", itemId);
      return next(new BadRequestError("Invalid item ID format."));
    }

    // Find the clothing item by ID
    const item = await ClothingItem.findById(itemId);

    if (!item) {
      console.log("Clothing item not found for ID:", itemId);
      return next(new NotFoundError("Clothing item not found."));
    }

    // Check if the logged-in user is the owner of the item
    if (item.owner !== req.user._id.toString()) {
      console.log(
        `User ${req.user._id} does not have permission to delete item ${itemId}`
      );
      return next(
        new ForbiddenError("You do not have permission to delete this item.")
      );
    }

    // Proceed to delete the item
    await ClothingItem.findByIdAndDelete(itemId);

    console.log(
      `Clothing item ${itemId} deleted successfully by user ${req.user._id}`
    );
    return res
      .status(200)
      .send({ message: "Clothing item deleted successfully." });
  } catch (err) {
    console.error("Delete Item Error:", err);

    // Handle CastError specifically
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID format."));
    }

    // Pass any other errors to the centralized error handler
    next(new InternalServerError());
  }
};

/**
 * Controller to like a clothing item
 */
const likeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id.toString();

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).orFail(new Error("Clothing item not found"));

    res.status(200).send(updatedItem);
  } catch (err) {
    console.error(err);
    if (err.message === "Clothing item not found") {
      return next(new NotFoundError("Clothing item not found."));
    } else if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID format."));
    } else {
      return next(new InternalServerError());
    }
  }
};

/**
 * Controller to dislike a clothing item
 */
const dislikeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id.toString();

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    ).orFail(new Error("Clothing item not found"));

    res.status(200).send(updatedItem);
  } catch (err) {
    console.error(err);
    if (err.message === "Clothing item not found") {
      return next(new NotFoundError("Clothing item not found."));
    } else if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID format."));
    } else {
      return next(new InternalServerError());
    }
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
