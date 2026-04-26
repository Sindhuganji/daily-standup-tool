const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createUpdate, getUpdates } = require("../controllers/updateController");

router.post("/", authMiddleware, createUpdate);
router.get("/", authMiddleware, getUpdates);

module.exports = router;