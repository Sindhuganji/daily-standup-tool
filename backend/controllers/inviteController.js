const Invitation = require("../models/Invitation");
const Team = require("../models/Team");
const User = require("../models/User");

// POST /api/invite/send
exports.sendInvite = async (req, res) => {
  try {
    const { email, teamId } = req.body;
    if (!email || !teamId) {
      return res.status(400).json({ message: "Email and teamId are required" });
    }

    const receiverEmail = email.toLowerCase().trim();

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    // 🔐 Backend admin check
    if (team.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only team admin can send invites" });
    }

    // prevent inviting existing member
    const targetUser = await User.findOne({ email: receiverEmail });
    if (targetUser) {
      const isAlreadyMember = team.members.some(
        (id) => id.toString() === targetUser._id.toString()
      );
      if (isAlreadyMember) {
        return res.status(400).json({ message: "User is already a team member" });
      }
    }

    // prevent duplicate pending invite
    const duplicate = await Invitation.findOne({
      teamId,
      receiverEmail,
      status: "pending",
    });
    if (duplicate) {
      return res.status(400).json({ message: "Pending invite already exists" });
    }

    const invite = await Invitation.create({
      teamId,
      sender: req.user._id,
      receiverEmail,
      status: "pending",
    });

    const populated = await Invitation.findById(invite._id)
      .populate("teamId", "name")
      .populate("sender", "name email");

    return res.status(201).json({ message: "Invite sent", invite: populated });
  } catch (err) {
    return res.status(500).json({ message: "Failed to send invite", error: err.message });
  }
};

// GET /api/invite/my
exports.getMyInvites = async (req, res) => {
  try {
    const myEmail = req.user.email.toLowerCase().trim();

    const invites = await Invitation.find({
      receiverEmail: myEmail,
      status: "pending",
    })
      .populate("teamId", "name")
      .populate("sender", "name email")
      .sort({ createdAt: -1 });

    return res.json(invites);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch invites", error: err.message });
  }
};

// POST /api/invite/accept/:id
exports.acceptInvite = async (req, res) => {
  try {
    const inviteId = req.params.id;

    const invite = await Invitation.findById(inviteId);
    if (!invite) return res.status(404).json({ message: "Invite not found" });

    if (invite.receiverEmail !== req.user.email.toLowerCase().trim()) {
      return res.status(403).json({ message: "Not allowed to accept this invite" });
    }

    if (invite.status !== "pending") {
      return res.status(400).json({ message: `Invite already ${invite.status}` });
    }

    const team = await Team.findById(invite.teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const alreadyMember = team.members.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!alreadyMember) {
      team.members.push(req.user._id);
      await team.save();
    }

    invite.status = "accepted";
    await invite.save();

    await User.findByIdAndUpdate(req.user._id, { teamId: team._id });

    return res.json({ message: "Invite accepted. Joined team successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Failed to accept invite", error: err.message });
  }
};

// POST /api/invite/reject/:id
exports.rejectInvite = async (req, res) => {
  try {
    const inviteId = req.params.id;

    const invite = await Invitation.findById(inviteId);
    if (!invite) return res.status(404).json({ message: "Invite not found" });

    if (invite.receiverEmail !== req.user.email.toLowerCase().trim()) {
      return res.status(403).json({ message: "Not allowed to reject this invite" });
    }

    if (invite.status !== "pending") {
      return res.status(400).json({ message: `Invite already ${invite.status}` });
    }

    invite.status = "rejected";
    await invite.save();

    return res.json({ message: "Invite rejected" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to reject invite", error: err.message });
  }
};