import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import { jwtSecret, publicUser } from '../utils/ownership.js';

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    jwtSecret(),
    { expiresIn: '7d' }
  );

const normalizeUsername = (username) =>
  String(username || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const username = normalizeUsername(req.body.username);

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'A user with that email or username already exists' });
    }

    const user = new User({ username, name, email, password });
    await user.save();

    res.status(201).json({
      token: signToken(user),
      user: publicUser(user),
      message: 'Account registered successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email/username and password are required' });
    }

    const identifier = email.toLowerCase();
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      token: signToken(user),
      user: publicUser(user),
      message: 'Login successful',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(publicUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
