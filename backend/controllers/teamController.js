const Team = require("../models/Team");
const User = require("../models/User");

// POST /api/team/create
exports.createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ msg: "Team name required" });
    }

    const team = await Team.create({
      name: name.trim(),
      admin: req.user.id,
      members: [req.user.id],
    });

    await User.findByIdAndUpdate(req.user.id, { teamId: team._id });

    console.log("[CREATE TEAM] user:", req.user.id, "team:", team._id);

    return res.status(201).json(team);
  } catch (err) {
    console.log("[CREATE TEAM ERROR]", err.message);
    return res.status(500).json({ msg: "Error creating team" });
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

    await User.findByIdAndUpdate(req.user.id, { teamId: team._id });

    console.log("[JOIN TEAM] user:", req.user.id, "team:", team._id);

    return res.json({ msg: "Joined team", team });
  } catch (err) {
    console.log("[JOIN TEAM ERROR]", err.message);
    return res.status(500).json({ msg: "Error joining team" });
  }
};

// GET /api/team/my
exports.getMyTeams = async (req, res) => {
  try {
    console.log("[GET MY TEAMS] USER ID:", req.user.id);

    // Query for members as array of ObjectId
    const teams = await Team.find({
      members: { $in: [req.user.id] },
    })
      .populate("members", "name email")
      .populate("admin", "name email")
      .sort({ createdAt: -1 });

    console.log("[GET MY TEAMS] FOUND TEAMS:", teams.length);
    console.log("[GET MY TEAMS] DATA:", teams);

    return res.json(teams);
  } catch (err) {
    console.log("[GET MY TEAMS ERROR]", err.message);
    return res.status(500).json({ msg: "Error fetching teams" });
  }
};