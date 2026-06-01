import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import User from './models/User.js'
import Question from './models/Question.js'
import Quiz from './models/Quiz.js'

mongoose.connect('mongodb://127.0.0.1:27017/SimpleQuiz')

const seedData = async () => {
    // Xóa data cũ
    await User.deleteMany()
    await Question.deleteMany()
    await Quiz.deleteMany()

    // Tạo user seed để làm author
    const hashedPassword = await bcrypt.hash('123456', 10)
    const seedUser = await User.create({
        username: 'admin',
        password: hashedPassword,
        admin: true
    })

    const questions = [
        {
            text: 'Triết học là hoạt động:',
            options: ['Tinh thần bậc cao', 'Vật chất', 'Vật chất và tinh thần', 'Hoạt động khoa học'],
            keywords: ['triết học'],
            correctAnswerIndex: 0,
            author: seedUser._id
        },
        {
            text: 'Triết học MLN kế thừa nền triết học nào?',
            options: ['Phương Tây', 'Phương Đông', 'Phương Đông và phương Tây', 'Tất cả các phương án trả lời đều đúng'],
            keywords: ['MLN'],
            correctAnswerIndex: 3,
            author: seedUser._id
        },
        {
            text: 'What is the capital city of France?',
            options: ['Paris', 'London', 'Berlin', 'Madrid'],
            keywords: ['capital', 'france'],
            correctAnswerIndex: 0,
            author: seedUser._id
        },
        {
            text: 'What is the capital city of Japan?',
            options: ['Osaka', 'Kyoto', 'Tokyo', 'Yokohama'],
            keywords: ['capital', 'japan'],
            correctAnswerIndex: 2,
            author: seedUser._id
        },
        {
            text: 'What is the capital city of Australia?',
            options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
            keywords: ['capital', 'australia'],
            correctAnswerIndex: 2,
            author: seedUser._id
        },
        {
            text: 'Is Washington, D.C. the capital city of the United States?',
            options: ['Yes', 'No'],
            keywords: ['capital', 'usa'],
            correctAnswerIndex: 0,
            author: seedUser._id
        }
    ]

    const insertedQuestions = await Question.insertMany(questions)

    const trietQuestionIds = insertedQuestions
        .filter(q => !q.text.toLowerCase().includes('capital'))
        .map(q => q._id)

    const capitalQuestionIds = insertedQuestions
        .filter(q => q.text.toLowerCase().includes('capital'))
        .map(q => q._id)

    await Quiz.create({
        title: 'Quiz Triết',
        description: 'Quiz về triết học',
        questions: trietQuestionIds
    })

    await Quiz.create({
        title: 'Science Quiz',
        description: 'Test your knowledge of scientific concepts and capitals!',
        questions: capitalQuestionIds
    })

    console.log('Seed thành công!')
    console.log('User admin: username=admin, password=123456')
    mongoose.disconnect()
}

seedData()