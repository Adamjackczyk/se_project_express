const express = require("express");
const userRoutes = require("./users");
const clothingItemRoutes = require("./clothingItems");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/items", clothingItemRoutes);

module.exports = router;
