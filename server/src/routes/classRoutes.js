const express = require("express");
const router = express.Router();
const { getPublicClasses, registerForClass } = require("../controllers/classController");

router.get("/", getPublicClasses);
router.post("/:id/register", registerForClass);

module.exports = router;