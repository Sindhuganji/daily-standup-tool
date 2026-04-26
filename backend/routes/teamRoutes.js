const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createTeam, joinTeam, getMyTeams } = require("../controllers/teamController");

router.post("/create", authMiddleware, createTeam);
router.post("/join", authMiddleware, joinTeam);
router.get("/my", authMiddleware, getMyTeams);

module.exports = router;