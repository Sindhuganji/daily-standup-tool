import express from 'express';

import {
  createUpdate,
  getUpdates,
} from '../controllers/updateController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/", authMiddleware, createUpdate);
router.get("/", authMiddleware, getUpdates);

export default router;