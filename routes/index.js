const express = require("express");
const userRoutes = require("./users");
const clothingItemRoutes = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/signin", login);
router.post("/signup", createUser);

router.use(auth);

router.use("/users", userRoutes);
router.use("/items", clothingItemRoutes);

module.exports = router;
