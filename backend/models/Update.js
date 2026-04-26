const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    yesterday: { type: String, default: "" },
    today: { type: String, required: true },
    blockers: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Update", updateSchema);