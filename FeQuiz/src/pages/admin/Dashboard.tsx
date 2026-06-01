import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteQuiz, useQuizzes } from '../../api/useQuizHooks';

import QuizModal from '../../components/QuizModal';
import type { Quiz } from '../../types/api.type';

const Dashboard: React.FC = () => {
  const { data: quizzes, isLoading, error } = useQuizzes();
  const deleteQuizMutation = useDeleteQuiz();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedQuiz(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài trắc nghiệm này không?')) {
      deleteQuizMutation.mutate(id, {
        onSuccess: () => alert('Đã xóa thành công bài trắc nghiệm!'),
        onError: (err: unknown) => alert((err as { message: string }).message),
      });
    }
  };

  // Hàm xử lý Đăng xuất
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      navigate('/login');
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>

      {/* Sidebar Navigation */}
      <aside className="vh-100 position-fixed start-0 top-0 bg-white border-end d-flex flex-column py-4 d-none d-md-flex" style={{ width: '260px', zIndex: 10 }}>
        <div className="px-4 mb-4">
          <h1 className="h5 fw-bold text-dark m-0">Admin Panel</h1>
          <p className="small text-muted m-0">Enterprise Mode</p>
        </div>
        
        <nav className="nav flex-column px-2 gap-1 flex-grow-1">
          <a className="nav-link px-3 py-2 bg-primary bg-opacity-10 text-primary fw-semibold border-start border-4 border-primary rounded d-flex align-items-center gap-3" href="#" onClick={(e) => e.preventDefault()}>
            <span className="material-symbols-outlined">dashboard</span>Dashboard
          </a>
        </nav>

        {/* Nút Logout nằm ở cuối Sidebar */}
        <div className="px-2 mt-auto border-top pt-3">
          <a className="nav-link px-3 py-2 text-danger d-flex align-items-center gap-3 rounded" href="#" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">logout</span>Đăng xuất
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ marginLeft: '260px' }}>
        <header className="bg-white border-bottom sticky-top px-4 py-2 shadow-sm" style={{ height: '64px' }}>
          <div className="d-flex justify-content-between align-items-center h-100">
            <span className="h4 fw-bold text-primary m-0">QuizMaster Pro</span>
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU7xYpG2eSU9Wqi5SaCffwSW5lHrP8xRfuiNsoR1BiSUEAbb6fTzNPgu5HZBZOZ4Rtm5D7SXttVXWXdD48dwmiAcZgTxkReV9po26rBSUrPA0aoUY40A0_8HcoK6K1MV0smO0_wcwH52Y1X3bH89clYHZauTV0bLDiL3t6e8K9tFe5-7zoVrZ3O7JANCcNjE21E7FqGED--UxRwEfS0XYr2OgxI74lgc7467H1xIEvf9Y00fudf7ba7dhvqsH0vpGRHUHMF9mSSnDD" alt="Profile" className="rounded-circle border border-2 border-primary" style={{ width: '36px', height: '36px', objectFit: 'cover' }} />
          </div>
        </header>

        <main className="p-4">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="fw-bold m-0 text-dark">Quiz Management</h2>
              <p className="text-muted m-0">Create and organize your enterprise-level assessments.</p>
            </div>
            <button className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 shadow-sm" onClick={handleOpenCreateModal}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
              Create New Quiz
            </button>
          </div>

          {isLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
          )}

          {error && <div className="alert alert-danger">{error.message}</div>}

          {/* Bento Grid layout */}
          {!isLoading && !error && (
            <div className="row g-4">
              {quizzes?.map((quiz) => (
                <div key={quiz._id} className="col-12 col-md-6 col-lg-4">
                  <div 
                    className="card h-100 shadow-sm border-0 position-relative" 
                    style={{ borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('button')) return;
                      navigate(`/dashboard/quizzes/${quiz._id}`);
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div className="p-3 bg-primary bg-opacity-10 text-center border-bottom d-flex align-items-center justify-content-center" style={{ height: '120px' }}>
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: '44px' }}>quiz</span>
                    </div>
                    <div className="card-body d-flex flex-column p-4">
                      <h4 className="card-title h5 fw-bold text-dark mb-2">{quiz.title}</h4>
                      <p className="card-text text-muted small flex-grow-1" style={{ whiteSpace: 'pre-line' }}>{quiz.description}</p>
                      
                      <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
                        <span className="text-primary small fw-bold">
                          <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '18px' }}>list_alt</span>
                          {quiz.questions?.length || 0} câu hỏi
                        </span>
                        
                        <div className="d-flex gap-1">
                          <button className="btn btn-light btn-sm text-secondary p-2 d-inline-flex align-items-center border-0 rounded-3" title="Chỉnh sửa bài trắc nghiệm" onClick={() => handleOpenEditModal(quiz)}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                          </button>
                          <button className="btn btn-light btn-sm text-danger p-2 d-inline-flex align-items-center border-0 rounded-3" title="Xóa bài trắc nghiệm" onClick={() => handleDelete(quiz._id)} disabled={deleteQuizMutation.isPending}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <QuizModal
        key={selectedQuiz?._id || 'create'}  
        show={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedQuiz(null); 
        }}
        editQuiz={selectedQuiz}
      />
    </div>
  );
};

export default Dashboard;