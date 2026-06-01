import { BarChart3, BookOpen, LogOut, PlayCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuizzes } from '../api/useQuizHooks'

const SkeletonCard = () => (
  <div
    style={{
      border: '1px solid #c7c4d8',
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    <div style={{ height: '180px', backgroundColor: '#e4e1ee' }} />
    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '12px', backgroundColor: '#e4e1ee', marginBottom: '8px', borderRadius: '4px' }} />
      <div style={{ height: '16px', backgroundColor: '#e4e1ee', marginBottom: '8px', borderRadius: '4px' }} />
      <div style={{ height: '14px', backgroundColor: '#e4e1ee', marginBottom: '16px', borderRadius: '4px', flex: 1 }} />
      <div style={{ height: '40px', backgroundColor: '#e4e1ee', borderRadius: '4px' }} />
    </div>
  </div>
)

interface MessageProps {
  message: string
}

const ErrorMessage = ({ message }: MessageProps) => (
  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px', color: '#ba1a1a' }}>
    <p style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Loi tai du lieu</p>
    <p style={{ fontSize: '14px', margin: '8px 0 0' }}>{message}</p>
  </div>
)

const EmptyMessage = ({ message }: MessageProps) => (
  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 24px', color: '#464555', backgroundColor: '#ffffff', border: '1px solid #e4e1ee', borderRadius: '12px' }}>
    <BookOpen size={40} style={{ color: '#3525cd', marginBottom: '12px' }} />
    <p style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#1b1b24' }}>{message}</p>
  </div>
)

export default function DashboardUser() {
  const navigate = useNavigate()
  const { data: quizzes = [], isLoading, error } = useQuizzes()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fcf8ff' }}>
      <aside style={{ width: '256px', position: 'fixed', left: 0, top: 0, height: '100vh', backgroundColor: '#f0ecf9', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', padding: '24px', zIndex: 50 }}>
        <div style={{ marginBottom: '48px', textAlign: 'left' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1b1b24', margin: 0 }}>QuizMaster Pro</h1>
          <p style={{ fontSize: '14px', opacity: 0.7, marginTop: '4px', color: '#1b1b24', marginBottom: 0 }}>User Dashboard</p>
        </div>

        <nav style={{ flex: 1 }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', backgroundColor: '#4f46e5', color: '#ffffff', borderLeft: '4px solid #3525cd', textDecoration: 'none', borderRadius: '4px', fontWeight: 600 }}>
            <BarChart3 size={20} />
            <span>Explore Quizzes</span>
          </a>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #c7c4d8', paddingTop: '24px' }}>
          <button onClick={handleLogout} type="button" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', color: '#ba1a1a', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main style={{ marginLeft: '256px', minHeight: '100vh', width: '100%' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '1px solid #c7c4d8', padding: 0 }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', minHeight: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', padding: '12px 32px' }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '13px', color: '#464555', margin: 0 }}>Dashboard</p>
              <strong style={{ color: '#1b1b24', fontSize: '18px' }}>Available Quizzes</strong>
            </div>

            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f0ecf9', border: '1px solid #c7c4d8', overflow: 'hidden', flexShrink: 0 }}>
              <img alt="User Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqzklbTu6_H_jQOVtDkYgEy8ygh9NygYNSOGJWnNAvcCvvBOFnQxdxAdYmbZSKi4aDjofs5-VQjHg7Qm_vDm8zsk7KvCkAGbuwQ3p_6-d8ZGbP6rsAP5-3AS2P9uhc4p7KVl9B43gw04zJTMOSPQ8ql8PrYFu0pslR9Qs4Hu-BGjwC3cqz3lg2v6Dj5JLIRmQJr8D2yy7i64PqyY_lpheUWxcmknVYYi9YZfhZ6R4F4uLHQXPhteOTqenRrhN35MojAaUG3n9M_Q4k" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </header>

        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px', marginBottom: '24px', textAlign: 'left' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#1b1b24' }}>
                Available Quizzes
              </h2>
              <p style={{ fontSize: '14px', color: '#464555', marginTop: '6px', marginBottom: 0 }}>
                Chon mot quiz de bat dau lam bai.
              </p>
            </div>
          </div>

          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {isLoading ? (
              <>
                {[...Array(4)].map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))}
              </>
            ) : error ? (
              <ErrorMessage message={error instanceof Error ? error.message : 'Khong the tai quizzes'} />
            ) : quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <article
                  key={quiz._id}
                  style={{
                    border: '1px solid #c7c4d8',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden', background: 'linear-gradient(135deg, #eef2ff 0%, #e2dfff 48%, #f5f2ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={56} style={{ color: '#3525cd', opacity: 0.35 }} />
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px', color: '#1b1b24' }}>{quiz.title}</h3>
                    <p style={{ fontSize: '14px', color: '#464555', margin: '0 0 16px', flex: 1 }}>{quiz?.description}</p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '12px', borderTop: '1px solid #e4e1ee' }}>
                      <span style={{ fontSize: '12px', color: '#464555', whiteSpace: 'nowrap' }}>{quiz.questions?.length ?? 0} cau hoi</span>
                      <button
                        type="button"
                        onClick={() => handleStartQuiz(quiz._id)}
                        style={{ backgroundColor: '#3525cd', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <PlayCircle size={14} />
                        <span>Bat dau</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <EmptyMessage message="Khong co quiz nao" />
            )}
          </section>
        </div>

        <footer style={{ marginTop: '48px', borderTop: '1px solid #c7c4d8', backgroundColor: '#ffffff', padding: '32px' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
            <div>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#3525cd' }}>QuizMaster Pro</span>
              <p style={{ fontSize: '14px', color: '#464555', opacity: 0.8, marginTop: '4px', marginBottom: 0 }}>Empowering learners worldwide.</p>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#" style={{ fontSize: '14px', color: '#464555', textDecoration: 'none' }}>Privacy</a>
              <a href="#" style={{ fontSize: '14px', color: '#464555', textDecoration: 'none' }}>Terms</a>
              <a href="#" style={{ fontSize: '14px', color: '#464555', textDecoration: 'none' }}>Support</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
