const router = require("express").Router();

router.get("/", () => console.log("GET /clothingItem by Id"));
router.post("/", () => console.log("POST /clothingItem by Id"));
router.delete("/:itemId", () => console.log("GET /clothingItem by Id"));

module.exports = router;
