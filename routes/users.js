const router = require("express").Router();

router.get("/", () => console.log("GET /users"));
router.get("/:userId", () => console.log("GET /user by Id"));
router.post("/", () => console.log("Post /users"));

module.exports = router;
