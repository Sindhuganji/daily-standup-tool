import express from 'express';

import {
  createTeam,
  getMyTeams,
  joinTeam,
} from '../controllers/teamController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/create", authMiddleware, createTeam);
router.post("/join", authMiddleware, joinTeam);
router.get("/my", authMiddleware, getMyTeams);

export default router;