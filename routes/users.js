const express = require("express");
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { updateUserProfileValidation } = require("../middlewares/validation");

const router = express.Router();

router.use(auth);

router.get("/me", getCurrentUser);
router.patch("/me", updateUserProfileValidation, updateUser);

module.exports = router;
