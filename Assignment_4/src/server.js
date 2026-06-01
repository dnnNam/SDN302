import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import userRouter from './routes/users.router.js'
import quizRouter from './routes/quiz.router.js'
import questionRouter from './routes/question.router.js'

dotenv.config()
const app = express()

app.use(cors({
  origin: '*', // Cho phép tất cả các domain gọi API trong quá trình test deploy
  credentials: true
}))
app.use(express.json())
connectDB()


app.use(express.json())

app.use("/users" , userRouter)
app.use("/quizzes", quizRouter)
app.use("/questions", questionRouter)


app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server bắt đầu trên cổng ${PORT}`)
})