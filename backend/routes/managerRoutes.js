import express from 'express';

import {
  getAllTeams,
  getAllUpdates,
  getTeamUpdates,
} from '../controllers/managerController.js';
import managerMiddleware from '../middleware/managerMiddleware.js';

const router = express.Router();

// Protect all manager routes
router.use(managerMiddleware);

router.get("/teams", getAllTeams);
router.get("/updates", getAllUpdates);
router.get("/team/:teamId", getTeamUpdates);

export default router;