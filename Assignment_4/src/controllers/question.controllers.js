import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js"; // 1. IMPORT THÊM MODEL QUIZ ĐỂ LIÊN KẾT

export const getALLQuestion = async (req, res, next) => {
  try {
    const questions = await Question.find().populate('author', 'username');
    res.json(questions);
  } catch (err) {
    next(err);
  }
}

export const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).populate('author', 'username');
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (err) {
    next(err);
  }
}

// 2. CẬP NHẬT: SỬA HÀM TẠO CÂU HỎI TỰ ĐỘNG ĐẨY VÀO QUIZ
export const createQuestion = async (req, res, next) => {
  try {
    const { quizId, ...questionData } = req.body;

    if (!quizId) {
      return res.status(400).json({ message: 'quizId là bắt buộc để liên kết câu hỏi!' });
    }

    // Tạo câu hỏi mới trong DB, lấy author từ req.user._id (được nạp từ middleware verifyUser)
    const newQuestion = await Question.create({ 
      ...questionData, 
      author: req?.user?._id 
    });

    // Tự động tìm bài Quiz tương ứng và đẩy _id của câu hỏi mới vào mảng questions của Quiz đó
    await Quiz.findByIdAndUpdate(
      quizId,
      { $push: { questions: newQuestion._id } }
    );

    res.status(201).json(newQuestion);
  } catch (err) {
    next(err); // Chuyển lỗi sang middleware để không bị crash 500
  }
}

// 3. CẬP NHẬT: ĐỔI { new: true } THÀNH { returnDocument: 'after' } THEO KHUYẾN NGHỊ MONGOOSE
export const updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.questionId,
      { $set: req.body },
      { returnDocument: 'after' } // Đã sửa dứt điểm cảnh báo Mongoose Warning
    );
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (err) {
    next(err);
  }
}

export const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    
    // (Tùy chọn) Có thể viết thêm logic xóa liên kết _id câu hỏi này trong mảng questions của Quiz tại đây nếu cần
    
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    next(err);
  }
}