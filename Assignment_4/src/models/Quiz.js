import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    questions: [
        {
            type: mongoose.Schema.Types.ObjectId, // lưu ID mongoDB
            ref: 'Question'
        }
    ]
})

const Quiz = mongoose.model('Quiz', quizSchema)
export default Quiz