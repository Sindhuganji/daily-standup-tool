const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    yesterday: { type: String, default: "" },
    today: { type: String, required: true },
    blockers: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Update", updateSchema);