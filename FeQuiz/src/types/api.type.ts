export interface Question {
   _id: string 
  text?: string
  question?: string
  options: string[]
  correctAnswerIndex?: number
  correctAnswer?: number
}

export  interface Quiz {
  _id: string
  title: string
  description?: string
  questions: Question[]
}