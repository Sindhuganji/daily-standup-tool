const Team = require("../models/Team");
const User = require("../models/User");

// POST /api/team/create
exports.createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ msg: "Team name required" });
    }

    // If your Team schema has admin, keep it. If not, remove admin.
    const payload = {
      name: name.trim(),
      members: [req.user.id],
    };

    if (Team.schema.path("admin")) {
      payload.admin = req.user.id;
    }

    const team = await Team.create(payload);

    // only if User schema has teamId
    if (User.schema.path("teamId")) {
      await User.findByIdAndUpdate(req.user.id, { teamId: team._id });
    }

    console.log("[CREATE TEAM] user:", req.user.id, "team:", team._id);

    return res.status(201).json(team);
  } catch (err) {
    console.log("[CREATE TEAM ERROR]", err);
    return res.status(500).json({ msg: "Error creating team", error: err.message });
  }
};

// POST /api/team/join
exports.joinTeam = async (req, res) => {
  try {
    const { teamId } = req.body;
    if (!teamId) {
      return res.status(400).json({ msg: "Team ID required" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    const alreadyMember = team.members.some(
      (m) => m.toString() === req.user.id.toString()
    );

    if (!alreadyMember) {
      team.members.push(req.user.id);
      await team.save();
    }

    if (User.schema.path("teamId")) {
      await User.findByIdAndUpdate(req.user.id, { teamId: team._id });
    }

    console.log("[JOIN TEAM] user:", req.user.id, "team:", team._id);

    return res.json({ msg: "Joined team", team });
  } catch (err) {
    console.log("[JOIN TEAM ERROR]", err);
    return res.status(500).json({ msg: "Error joining team", error: err.message });
  }
};

// GET /api/team/my
exports.getMyTeams = async (req, res) => {
  try {
    console.log("[GET MY TEAMS] req.user:", req.user);

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user id missing" });
    }

    // ✅ fetch teams where logged-in user is in members
    const teams = await Team.find({
      members: { $in: [userId] },
    })
      .populate("admin", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    console.log("[GET MY TEAMS] found:", teams.length);

    return res.status(200).json(teams);
  } catch (err) {
    console.error("[GET MY TEAMS ERROR]", err);
    return res.status(500).json({
      message: "Error fetching teams",
      error: err.message,
    });
  }
};