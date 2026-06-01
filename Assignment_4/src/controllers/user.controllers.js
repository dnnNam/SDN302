
import bcrypt from 'bcrypt'
import { getToken } from '../middlewares/authenticate.js';
import User from '../models/User.js';

export const registerUser = async (req, res) => {
const { username, password , admin } = req.body;

  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ message: 'Username already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashedPassword, admin });

  res.status(201).json({
    success: true,
    message: 'Registration successful!',
    user: { id: user._id, username: user.username, admin: user.admin }
  });
}

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Wrong password' });

  const token = getToken(user);
  res.json({
    success: true,
    token,
    message: 'You are logged in!',
    user: { id: user._id, username: user.username, admin: user.admin }
  });
}

export const getUserInfo = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
}
