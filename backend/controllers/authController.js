import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // role defaults to "member" automatically; UI unchanged
    await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
    });

    return res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    console.error("[REGISTER ERROR]:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ include role in token payload (login UI unchanged)
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role || "member",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error("[LOGIN ERROR]:", error);
    return res.status(500).json({ message: "Server error" });
  }
};