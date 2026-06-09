const express = require("express");
const router = express.Router();

const { createModule } = require("../controllers/moduleController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createModule);

module.exports = router;
console.log(createModule);