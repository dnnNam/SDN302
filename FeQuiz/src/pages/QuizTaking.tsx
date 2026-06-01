import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Flag, X } from 'lucide-react'
import { useQuizById } from '../api/useQuizHooks'

interface QuizState {
  currentQuestionIndex: number
  answers: Record<number, number>
  flaggedQuestions: Set<number>
  timeLeft: number
  finished: boolean
}

export default function QuizTaking() {
  const navigate = useNavigate()
  const { quizId } = useParams<{ quizId: string }>()
  const { data: quiz, isLoading, error } = useQuizById(quizId || '')

  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    flaggedQuestions: new Set(),
    timeLeft: 15 * 60,
    finished: false,
  })

  useEffect(() => {
    if (!quiz || state.finished) return

    const interval = setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 1) {
          return { ...prev, timeLeft: 0, finished: true }
        }

        return { ...prev, timeLeft: prev.timeLeft - 1 }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [quiz, state.finished])

  const formatTime = (seconds: number) => {
    const safeSeconds = Math.max(0, seconds)
    const mins = Math.floor(safeSeconds / 60)
    const secs = safeSeconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSelectOption = (optionIndex: number) => {
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [prev.currentQuestionIndex]: optionIndex
      }
    }))
  }

  const handleFlagQuestion = () => {
    setState((prev) => {
      const nextFlagged = new Set(prev.flaggedQuestions)

      if (nextFlagged.has(prev.currentQuestionIndex)) {
        nextFlagged.delete(prev.currentQuestionIndex)
      } else {
        nextFlagged.add(prev.currentQuestionIndex)
      }

      return {
        ...prev,
        flaggedQuestions: nextFlagged
      }
    })
  }

  const handlePrevious = () => {
    setState((prev) => ({
      ...prev,
      currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1)
    }))
  }

  const handleNext = () => {
    if (!quiz) return

    setState((prev) => {
      const isLastQuestion = prev.currentQuestionIndex >= quiz.questions.length - 1

      if (isLastQuestion) {
        return { ...prev, finished: true }
      }

      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }
    })
  }

  const handleClose = () => {
    navigate('/quiz-list')
  }

  const correctCount = useMemo(() => {
    if (!quiz) return 0

    return quiz.questions.reduce((score, question, index) => {
      const correctAnswer = question.correctAnswerIndex ?? question.correctAnswer
      return state.answers[index] === correctAnswer ? score + 1 : score
    }, 0)
  }, [quiz, state.answers])

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#fcf8ff' }}>
        <p style={{ fontSize: '18px', color: '#464555' }}>Dang tai quiz...</p>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#fcf8ff', padding: '24px' }}>
        <div style={{ maxWidth: '420px', textAlign: 'center', backgroundColor: '#ffffff', border: '1px solid #ffdad6', borderRadius: '12px', padding: '32px' }}>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#ba1a1a', margin: 0 }}>không lấy được bài quiz</p>
          <button onClick={handleClose} type="button" style={{ marginTop: '20px', backgroundColor: '#3525cd', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontWeight: 700, cursor: 'pointer' }}>
            Ve Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!quiz.questions.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#fcf8ff', padding: '24px' }}>
        <div style={{ maxWidth: '420px', textAlign: 'center', backgroundColor: '#ffffff', border: '1px solid #e4e1ee', borderRadius: '12px', padding: '32px' }}>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#1b1b24', margin: 0 }}>Quiz nay chua co cau hoi</p>
          <button onClick={handleClose} type="button" style={{ marginTop: '20px', backgroundColor: '#3525cd', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontWeight: 700, cursor: 'pointer' }}>
            Ve Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (state.finished) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fcf8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
        <section style={{ width: '100%', maxWidth: '520px', backgroundColor: '#ffffff', border: '1px solid #e4e1ee', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', padding: '32px', textAlign: 'center' }}>
          <CheckCircle2 size={56} style={{ color: '#3525cd', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1b1b24', letterSpacing: 0, margin: '0 0 8px' }}>Hoan thanh quiz</h1>
          <p style={{ fontSize: '15px', color: '#464555', margin: '0 0 24px' }}>{quiz.title}</p>
          <div style={{ backgroundColor: '#f5f2ff', border: '1px solid #c7c4d8', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <p style={{ color: '#464555', fontSize: '14px', margin: '0 0 8px' }}>Ket qua tam tinh</p>
            <p style={{ color: '#1b1b24', fontSize: '32px', fontWeight: 800, margin: 0 }}>
              {correctCount}/{quiz.questions.length}
            </p>
          </div>
          <button onClick={handleClose} type="button" style={{ backgroundColor: '#3525cd', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '11px 20px', fontWeight: 700, cursor: 'pointer' }}>
            Quay lai Dashboard
          </button>
        </section>
      </div>
    )
  }

  const currentQuestion = quiz.questions[state.currentQuestionIndex]
  const questionText = currentQuestion.text ?? currentQuestion.question ?? 'No question text'
  const selectedAnswer = state.answers[state.currentQuestionIndex]
  const progress = ((state.currentQuestionIndex + 1) / quiz.questions.length) * 100
  const isLastQuestion = state.currentQuestionIndex === quiz.questions.length - 1
  const isTimerDanger = state.timeLeft <= 60

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fcf8ff' }}>
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #c7c4d8', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', padding: 0 }}>
        <div style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0 }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#3525cd', whiteSpace: 'nowrap' }}>QuizMaster Pro</span>
            <div style={{ height: '24px', borderRight: '1px solid #c7c4d8' }} />
            <span style={{ fontSize: '16px', color: '#464555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{quiz.title}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            <div style={{ backgroundColor: '#eae6f4', border: '1px solid #c7c4d8', color: isTimerDanger ? '#ba1a1a' : '#1b1b24', fontWeight: 700, padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} style={{ color: isTimerDanger ? '#ba1a1a' : '#3525cd' }} />
              <span style={{ fontFamily: 'ui-monospace, Consolas, monospace' }}>{formatTime(state.timeLeft)}</span>
            </div>
            <button onClick={handleClose} type="button" aria-label="Close quiz" style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={24} style={{ color: '#464555' }} />
            </button>
          </div>
        </div>

        <div style={{ height: '6px', backgroundColor: '#e4e1ee', width: '100%', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(to right, #3525cd, #712ae2)', transition: 'width 0.3s ease' }} />
        </div>
      </header>

      <main style={{ flex: 1, padding: '40px 32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ backgroundColor: '#e2dfff', color: '#3525cd', padding: '8px 18px', borderRadius: '9999px', fontWeight: 700, fontSize: '14px' }}>
              Question {state.currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span style={{ fontSize: '12px', color: '#464555', fontWeight: 600 }}>Points: 10</span>
          </div>

          <section style={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '32px', marginBottom: '32px', textAlign: 'left' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 40px', lineHeight: 1.5, color: '#1b1b24', letterSpacing: 0 }}>
              {questionText}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    style={{
                      border: isSelected ? '2px solid #3525cd' : '2px solid #c7c4d8',
                      backgroundColor: isSelected ? '#e2dfff' : '#ffffff',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      width: '100%'
                    }}
                  >
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: isSelected ? 'none' : '2px solid #c7c4d8',
                        backgroundColor: isSelected ? '#3525cd' : 'transparent',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {isSelected && <span style={{ width: '8px', height: '8px', backgroundColor: '#ffffff', borderRadius: '50%' }} />}
                    </span>
                    <span style={{ fontSize: '16px', color: '#1b1b24' }}>{option}</span>
                  </button>
                )
              })}
            </div>
          </section>
        </div>
      </main>

      <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #c7c4d8', position: 'sticky', bottom: 0, padding: '16px 32px', marginTop: 'auto', boxShadow: '0 -1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handlePrevious}
            disabled={state.currentQuestionIndex === 0}
            type="button"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#464555',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              cursor: state.currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              opacity: state.currentQuestionIndex === 0 ? 0.5 : 1
            }}
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleFlagQuestion}
              type="button"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: state.flaggedQuestions.has(state.currentQuestionIndex) ? '#3525cd' : '#464555',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Flag size={20} fill={state.flaggedQuestions.has(state.currentQuestionIndex) ? '#3525cd' : 'none'} />
              <span>Flag Question</span>
            </button>

            <button
              onClick={handleNext}
              type="button"
              style={{
                backgroundColor: '#3525cd',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 28px',
                fontWeight: 800,
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(53, 37, 205, 0.2)'
              }}
            >
              <span>{isLastQuestion ? 'Finish' : 'Next'}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
