import mongoose from 'mongoose';

import Team from '../models/Team.js';
import Update from '../models/Update.js';

// GET /api/manager/teams
export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("admin", "name email role")
      .populate("members", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json(teams);
  } catch (error) {
    console.error("[MANAGER getAllTeams ERROR]:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/manager/updates
export const getAllUpdates = async (req, res) => {
  try {
    const updates = await Update.find()
      .populate("userId", "name email role")
      .populate("teamId", "name")
      .sort({ createdAt: -1 });

    // BONUS (optional): add a computed flag for UI highlighting
    const enriched = updates.map((u) => ({
      ...u.toObject(),
      hasBlockers: Boolean(u.blockers && u.blockers.trim()),
    }));

    return res.status(200).json(enriched);
  } catch (error) {
    console.error("[MANAGER getAllUpdates ERROR]:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/manager/team/:teamId
export const getTeamUpdates = async (req, res) => {
  try {
    const { teamId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Invalid teamId" });
    }

    const updates = await Update.find({ teamId })
      .populate("userId", "name email role")
      .populate("teamId", "name")
      .sort({ createdAt: -1 });

    const enriched = updates.map((u) => ({
      ...u.toObject(),
      hasBlockers: Boolean(u.blockers && u.blockers.trim()),
    }));

    return res.status(200).json(enriched);
  } catch (error) {
    console.error("[MANAGER getTeamUpdates ERROR]:", error);
    return res.status(500).json({ message: "Server error" });
  }
};