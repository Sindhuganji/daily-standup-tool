const Update = require("../models/Update");

const createUpdate = async (req, res) => {
  try {
    const { yesterday, today, blockers } = req.body;

    if (!today) {
      return res.status(400).json({ message: "Today is required" });
    }

    const update = await Update.create({
      user: req.user.id,
      yesterday,
      today,
      blockers,
    });

    res.status(201).json(update);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUpdates = async (req, res) => {
  try {
    const updates = await Update.find()
      .populate("user", "email name")
      .sort({ createdAt: -1 });

    res.json(updates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createUpdate, getUpdates };