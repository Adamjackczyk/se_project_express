const express = require("express");
const router = express.Router();
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");

// GET /items — returns all clothing items
router.get("/", getItems);

// POST /items — creates a new item
router.post("/", createItem);

// DELETE /items/:itemId — deletes an item by _id
router.delete("/:itemId", deleteItem);

module.exports = router;
