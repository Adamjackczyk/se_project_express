const express = require("express");
const userRoutes = require("./users");
const clothingItemRoutes = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const {
  createUserValidation,
  loginValidation,
} = require("../middlewares/validation");

const router = express.Router();

router.post("/signup", createUserValidation, createUser);
router.post("/signin", loginValidation, login);

router.use("/users", userRoutes);
router.use("/items", clothingItemRoutes);

module.exports = router;
