const express = require("express");
const auth = require("../middlewares/auth");
const {
  createClothingItemValidation,
  validateItemId,
} = require("../middlewares/validation");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const router = express.Router();
router.get("/", getItems);

router.use(auth);

router.post("/", createClothingItemValidation, createItem);

router.delete("/:itemId", validateItemId, deleteItem);

router.put("/:itemId/likes", validateItemId, likeItem);
router.delete("/:itemId/likes", validateItemId, dislikeItem);

module.exports = router;
