import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Question from '../models/Question.js';

const SECRET_KEY = process.env.JWT_SECRET;

// tạo JWT KEY 

export const getToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username, admin: user.admin }, SECRET_KEY, { expiresIn: '1h' });
}

export const verifyUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, SECRET_KEY); // Express v5 tự catch nếu invalid
  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.user = user;
  next();
};

export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin === true) return next();
  const err = new Error('You are not authorized to perform this operation!');
  err.status = 403;
  next(err);
};

export const verifyAuthor = async (req, res, next) => {
  const question = await Question.findById(req.params.questionId);
  if (!question) {
    const err = new Error('Question not found');
    err.status = 404;
    return next(err);
  }
  if (question.author.equals(req.user._id)) return next();
  const err = new Error('You are not the author of this question');
  err.status = 403;
  next(err);
};
