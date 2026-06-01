
import express from 'express';
import { createQuiz, deleteQuiz, getAllQuiz, getQuizById, updateQuiz } from '../controllers/quiz.controllers.js';
import { verifyAdmin, verifyUser } from '../middlewares/authenticate.js';
const quizRouter = express.Router();


quizRouter.get('/', getAllQuiz);
quizRouter.get('/:id', getQuizById);
quizRouter.post('/',  verifyUser, verifyAdmin, createQuiz);
quizRouter.put('/:id',  verifyUser, verifyAdmin, updateQuiz);
quizRouter.delete('/:id', verifyUser, verifyAdmin, deleteQuiz);
 

export default quizRouter;