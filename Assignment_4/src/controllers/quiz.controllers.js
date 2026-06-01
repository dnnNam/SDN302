import Quiz from "../models/Quiz.js";

export const getAllQuiz = async (req, res) => {
  const quizzes = await Quiz.find().populate("questions");
  res.json(quizzes);
}


export const getQuizById = async (req, res) => {
    const quiz = await Quiz.findById(req.params.id).populate("questions")
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
}

export const createQuiz = async (req, res) => {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
}

export const updateQuiz = async (req, res) => {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id,  
   { $set: req.body },
    { new: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
}

export const deleteQuiz = async (req, res) => {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json({ message: 'Quiz deleted successfully' });
}
