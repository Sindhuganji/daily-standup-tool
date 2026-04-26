const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  sendInvite,
  getMyInvites,
  acceptInvite,
  rejectInvite,
} = require("../controllers/inviteController");

router.post("/send", authMiddleware, sendInvite);
router.get("/my", authMiddleware, getMyInvites);
router.post("/accept/:id", authMiddleware, acceptInvite);
router.post("/reject/:id", authMiddleware, rejectInvite);

module.exports = router;