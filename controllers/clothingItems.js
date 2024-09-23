const ClothingItem = require("../models/clothingItem");

// Controller to get all clothing items
const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find()
      .populate("owner", "name avatar")
      .populate("likes", "name avatar");

    res.status(200).send(items);
  } catch (err) {
    res.status(500).send({ error: err.message });
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
      owner: req.user._id,
    });
    await clothingItem.save();

    res.status(201).send(clothingItem);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

// Controller to delete a clothing item by ID
const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const deletedItem = await ClothingItem.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).send({ message: "Clothing item not found" });
    }

    res.status(200).send({ message: "Clothing item deleted successfully" });
  } catch (err) {
    res.status(400).send({ error: "Invalid item ID format" });
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
};
