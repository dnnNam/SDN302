import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    keywords:{
        type: [String],
        default: []
    },
    correctAnswerIndex: {
        type: Number,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})
const Question = mongoose.model("Question", questionSchema)

export default Question