import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail)
      return res.status(409).json({ message: "Email already exists" });

    if (existingUsername)
      return res.status(409).json({ message: "Username already exists" });

    const user = new User({
      name,
      username,
      email,
      password,
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({
        message: "Invalid credentials",
      });

    const match = await bcryptjs.compare(
      password,
      user.password
    );

    if (!match)
      return res.status(401).json({
        message: "Invalid credentials",
      });

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};