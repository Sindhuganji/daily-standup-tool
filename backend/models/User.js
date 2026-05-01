import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },

    // ✅ NEW: role system (backward-compatible)
    role: {
      type: String,
      enum: ["member", "manager"],
      default: "member",
    },

    // keep if your project already uses it
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;