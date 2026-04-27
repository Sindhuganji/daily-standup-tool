import Team from '../models/Team.js'; // fixes "Team.find is not a function"
import Update from '../models/Update.js';

// POST /api/update
export const createUpdate = async (req, res) => {
  try {
    const { yesterday = "", today = "", blockers = "" } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!today || !today.trim()) {
      return res.status(400).json({ message: "Today is required" });
    }

    const team = await Team.findOne({ members: { $in: [userId] } }).select("_id");
    if (!team) {
      return res.status(400).json({ message: "Join or create a team first" });
    }

    const update = await Update.create({
      userId: userId,
      teamId: team._id,
      yesterday,
      today: today.trim(),
      blockers,
    });

    return res.status(201).json({
      message: "Update submitted successfully",
      update,
    });
  } catch (error) {
    console.error("[CREATE UPDATE ERROR]:", error);
    return res.status(500).json({
      message: "Failed to create update",
      error: error.message,
    });
  }
};

// GET /api/update
export const getUpdates = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const teams = await Team.find({ members: { $in: [userId] } }).select("_id");
    const teamIds = teams.map((t) => t._id);

    const updates = await Update.find({ teamId: { $in: teamIds } })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(updates);
  } catch (error) {
    console.error("[GET UPDATES ERROR]:", error);
    return res.status(500).json({
      message: "Failed to fetch updates",
      error: error.message,
    });
  }
};