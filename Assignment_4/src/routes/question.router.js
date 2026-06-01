import express from "express"
import { createQuestion, deleteQuestion, getALLQuestion, getQuestionById, updateQuestion } from "../controllers/question.controllers.js"
import { verifyAdmin, verifyAuthor, verifyUser } from "../middlewares/authenticate.js"

const questionRouter = express.Router()


questionRouter.get("/", getALLQuestion )

questionRouter.get("/:id", getQuestionById)

questionRouter.post("/", verifyUser, verifyAdmin,  createQuestion)

questionRouter.put("/:questionId", verifyUser, verifyAdmin, updateQuestion)

questionRouter.delete("/:questionId", verifyUser, verifyAdmin, deleteQuestion)

export default questionRouter