const express = require("express");
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  updateUserProfileValidation,
  validateUserId, // If you have routes that require userId
} = require("../middlewares/validation");

const router = express.Router();

router.use(auth);

router.get("/me", getCurrentUser);
router.patch("/me", updateUserProfileValidation, updateUser);

module.exports = router;
