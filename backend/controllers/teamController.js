import mongoose from 'mongoose';

import Team from '../models/Team.js';
import User from '../models/User.js';

// POST /api/team/create
export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Team name is required" });
    }

    const team = await Team.create({
      name: name.trim(),
      admin: userId,
      members: [userId],
    });

    if (User.schema.path("teamId")) {
      await User.findByIdAndUpdate(userId, { teamId: team._id });
    }

    return res.status(201).json({
      message: "Team created successfully",
      team,
    });
  } catch (error) {
    console.error("[CREATE TEAM ERROR]:", error);
    return res.status(500).json({
      message: "Failed to create team",
      error: error.message,
    });
  }
};

// POST /api/team/join
export const joinTeam = async (req, res) => {
  try {
    const { teamId } = req.body;
    const userId = req.user?.id;

    // 1) validate auth + input
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!teamId) {
      return res.status(400).json({ message: "Team ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Invalid Team ID format" });
    }

    // 2) find existing team (DO NOT create new one)
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // 3) ensure members array exists
    if (!Array.isArray(team.members)) {
      team.members = [];
    }

    // 4) check already member using toString()
    const alreadyMember = team.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );

    if (alreadyMember) {
      return res.status(200).json({
        message: "User is already a member of this team",
        team,
      });
    }

    // 5) add user to members only (DO NOT touch admin)
    team.members.push(userId);

    // 6) save team
    await team.save();

    // optional user linkage
    if (User.schema.path("teamId")) {
      await User.findByIdAndUpdate(userId, { teamId: team._id });
    }

    // 7) success
    return res.status(200).json({
      message: "Joined team successfully",
      team,
    });
  } catch (error) {
    console.error("[JOIN TEAM ERROR]:", error);
    return res.status(500).json({
      message: "Failed to join team",
      error: error.message,
    });
  }
};

// GET /api/team/my
export const getMyTeams = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const teams = await Team.find({
      members: { $in: [userId] },
    })
      .populate("admin", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(teams);
  } catch (error) {
    console.error("[GET MY TEAMS ERROR]:", error);
    return res.status(500).json({
      message: "Failed to fetch teams",
      error: error.message,
    });
  }
};