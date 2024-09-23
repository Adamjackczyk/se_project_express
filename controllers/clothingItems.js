const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// Controller to get all clothing items
const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find()
      .populate("owner", "name avatar")
      .populate("likes", "name avatar");

    res.status(200).send(items);
  } catch (err) {
    console.error(err);
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

// Controller to create a new clothing item
const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;

    const clothingItem = new ClothingItem({
      name,
      weather,
      imageUrl,
      owner: req.user._id, // Assign owner from middleware
    });
    await clothingItem.save();

    res.status(201).send(clothingItem);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      res.status(BAD_REQUEST).send({ message: err.message });
    } else {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    }
  }
};

// Controller to delete a clothing item by ID
const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const deletedItem = await ClothingItem.findByIdAndDelete(itemId).orFail(
      new Error("Clothing item not found")
    );

    res.status(200).send({ message: "Clothing item deleted successfully" });
  } catch (err) {
    console.error(err);
    if (err.message === "Clothing item not found") {
      res.status(NOT_FOUND).send({ message: "Clothing item not found" });
    } else if (err.name === "CastError") {
      res.status(BAD_REQUEST).send({ message: "Invalid item ID format" });
    } else {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    }
  }
};

//Controler to handle likes

const likeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).orFail(new Error("Clothing item not found"));

    res.status(200).send(updatedItem);
  } catch (err) {
    console.error(err);
    if (err.message === "Clothing item not found") {
      res.status(NOT_FOUND).send({ message: "Clothing item not found" });
    } else if (err.name === "CastError") {
      res.status(BAD_REQUEST).send({ message: "Invalid item ID format" });
    } else {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    }
  }
};

const dislikeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    ).orFail(new Error("Clothing item not found"));

    res.status(200).send(updatedItem);
  } catch (err) {
    console.error(err);
    if (err.message === "Clothing item not found") {
      res.status(NOT_FOUND).send({ message: "Clothing item not found" });
    } else if (err.name === "CastError") {
      res.status(BAD_REQUEST).send({ message: "Invalid item ID format" });
    } else {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
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
