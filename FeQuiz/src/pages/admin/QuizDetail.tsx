import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import type { Question } from '../../types/api.type';
import { useQuizById } from '../../api/useQuizHooks';
import { useCreateQuestion, useDeleteQuestion, useUpdateQuestion } from '../../api/useQuestionHook';
import QuestionModal from '../../components/QuestionModal';

const QuizDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: quiz, isLoading, error } = useQuizById(id || '');
  
  const createQuestionMutation = useCreateQuestion();
  const updateQuestionMutation = useUpdateQuestion();
  const deleteQuestionMutation = useDeleteQuestion();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  // Tạo thêm một state để lưu timestamp khi bấm Add, giúp đổi key liên tục đảm bảo reset form 100%
  const [modalKeySuffix, setModalKeySuffix] = useState<string>('');

  const handleOpenCreateModal = () => {
    setSelectedQuestion(null);
    setModalKeySuffix(Date.now().toString()); // Sinh chuỗi duy nhất cho mỗi lần bấm Tạo mới
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (question: Question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này không?')) {
      deleteQuestionMutation.mutate({ quizId: id || '', questionId }, {
        onSuccess: () => alert('Đã xóa câu hỏi thành công!'),
        onError: (err: unknown) => alert((err as { message: string }).message || 'Lỗi khi xóa câu hỏi'),
      });
    }
  };

  const handleSaveQuestion = (formData: Partial<Question>) => {
    if (!id) return;
    if (selectedQuestion) {
      updateQuestionMutation.mutate(
        { quizId: id, questionId: selectedQuestion._id, data: formData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            alert('Cập nhật câu hỏi thành công!');
          },
          onError: (err: unknown) => alert((err as { message: string }).message),
        }
      );
    } else {
      createQuestionMutation.mutate(
        { quizId: id, data: formData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            alert('Tạo câu hỏi mới thành công!');
          },
          onError: (err: unknown) => alert((err as { message: string }).message),
        }
      );
    }
  };

  // Hàm xử lý Logout đồng bộ với Dashboard
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const questionsList = (quiz?.questions as unknown as Question[]) || [];

  return (
    <div className="d-flex bg-light min-vh-100">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Sidebar Navigation */}
      <aside className="vh-100 position-fixed start-0 top-0 bg-white border-end d-flex flex-column py-4 d-none d-md-flex" style={{ width: '260px', zIndex: 10 }}>
        <div className="px-4 mb-4">
          <h1 className="h5 fw-bold text-dark m-0">Admin Panel</h1>
          <p className="small text-muted m-0">Enterprise Mode</p>
        </div>
        <nav className="nav flex-column px-2 gap-1 flex-grow-1">
          <a className="nav-link px-3 py-2 text-secondary d-flex align-items-center gap-3 rounded" href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
            <span className="material-symbols-outlined">dashboard</span>Dashboard
          </a>
        </nav>

        {/* Nút Logout được thêm ở cuối thanh aside */}
        <div className="px-2 mt-auto border-top pt-3">
          <a 
            className="nav-link px-3 py-2 text-danger d-flex align-items-center gap-3 rounded" 
            href="#" 
            onClick={(e) => { e.preventDefault(); handleLogout(); }}
          >
            <span className="material-symbols-outlined">logout</span>Logout
          </a>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="flex-grow-1" style={{ marginLeft: '260px' }}>
        
        {/* Header Bar */}
        <header className="bg-white border-bottom sticky-top px-4 shadow-sm" style={{ height: '64px', zIndex: 9 }}>
          <div className="d-flex justify-content-between align-items-center h-100">
            <span className="h4 fw-bold text-primary m-0">QuizMaster Pro</span>
            <div className="d-flex align-items-center gap-4">
              {/* Đã xóa ô tìm kiếm ở đây */}
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU7xYpG2eSU9Wqi5SaCffwSW5lHrP8xRfuiNsoR1BiSUEAbb6fTzNPgu5HZBZOZ4Rtm5D7SXttVXWXdD48dwmiAcZgTxkReV9po26rBSUrPA0aoUY40A0_8HcoK6K1MV0smO0_wcwH52Y1X3bH89clYHZauTV0bLDiL3t6e8K9tFe5-7zoVrZ3O7JANCcNjE21E7FqGED--UxRwEfS0XYr2OgxI74lgc7467H1xIEvf9Y00fudf7ba7dhvqsH0vpGRHUHMF9mSSnDD" alt="Profile" className="rounded-circle border border-2 border-primary" style={{ width: '36px', height: '36px', objectFit: 'cover' }} />
            </div>
          </div>
        </header>

        {/* Workspace Canvas */}
        <main className="p-4">
          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb m-0 small">
              <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-secondary" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>Dashboard</a></li>
              <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-secondary" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>Manage Quizzes</a></li>
              <li className="breadcrumb-item active fw-bold text-primary" aria-current="page">Quiz Detail</li>
            </ol>
          </nav>

          {isLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
          )}

          {error && <div className="alert alert-danger shadow-sm">{error.message || 'Lỗi không thể tải dữ liệu.'}</div>}

          {!isLoading && !error && quiz && (
            <>
              {/* Quiz Summary Block */}
              <div className="card border-0 shadow-sm p-4 mb-4 bg-white" style={{ borderRadius: '12px' }}>
                <div className="row align-items-end g-3">
                  <div className="col-12 col-lg-9">
                    <h2 className="fw-bold text-dark mb-2">{quiz.title}</h2>
                    <p className="text-muted mb-3 small" style={{ whiteSpace: 'pre-line' }}>{quiz.description}</p>
                    
                    <div className="d-flex flex-wrap gap-2">
                      <div className="bg-light text-dark border rounded-3 px-3 py-1.5 d-flex align-items-center gap-2 small fw-medium">
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>format_list_bulleted</span>
                        {questionsList.length} Câu hỏi
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 col-lg-3 text-lg-end">
                    <button className="btn btn-primary d-inline-flex align-items-center gap-2 px-3 py-2 shadow-sm rounded-3 fw-medium" onClick={handleOpenCreateModal}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                      Tạo câu hỏi mới
                    </button>
                  </div>
                </div>
              </div>

              {/* Title Section */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <h3 className="h5 fw-bold text-dark m-0">Danh sách câu hỏi</h3>
              </div>

              {/* Questions Grid */}
              <div className="row g-4">
                {questionsList.length > 0 ? (
                  questionsList.map((question, index) => (
                    <div key={question._id} className="col-12 col-md-6 col-lg-4">
                      <div 
                        className="card h-100 shadow-sm border-0 bg-white rounded-3"
                        style={{ transition: 'transform 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <div className="card-body d-flex flex-column p-4">
                          
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="badge bg-primary bg-opacity-10 text-primary border-0 px-2.5 py-1.5 rounded-pill small fw-bold" style={{ fontSize: '11px' }}>
                              CÂU HỎI {index + 1}
                            </span>
                            <span className="small text-muted fw-semibold">
                              {question.options?.length || 0} Lựa chọn
                            </span>
                          </div>
                          
                          <p className="card-text text-dark fw-bold mb-3" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                            {question.text || question.question}
                          </p>

                          <div className="flex-grow-1 mb-4">
                            {question.options?.map((option, optIdx) => {
                              const isCorrect = optIdx === question.correctAnswerIndex || optIdx === question.correctAnswer;
                              return (
                                <div 
                                  key={optIdx} 
                                  className={`p-2 rounded-2 small mb-1 border ${
                                    isCorrect 
                                      ? 'bg-success bg-opacity-10 text-success border-success border-opacity-25 fw-semibold' 
                                      : 'bg-light text-secondary border-transparent'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIdx)}. {option}
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="d-flex align-items-center justify-content-end pt-3 border-top mt-auto border-light">
                            <div className="d-flex gap-1">
                              <button className="btn btn-light btn-sm text-secondary p-2 d-inline-flex align-items-center border-0 rounded-3 bg-opacity-50" title="Chỉnh sửa câu hỏi" onClick={() => handleOpenEditModal(question)}>
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                              </button>
                              <button 
                                className="btn btn-light btn-sm text-danger p-2 d-inline-flex align-items-center border-0 rounded-3 bg-opacity-50" 
                                title="Xóa câu hỏi" 
                                onClick={() => handleDeleteQuestion(question._id)}
                                disabled={deleteQuestionMutation.isPending}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <div className="text-muted bg-white p-5 rounded-3 shadow-sm">Không có câu hỏi nào trong quiz này.</div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <QuestionModal
        key={selectedQuestion?._id || `create-${modalKeySuffix}`}
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuestion}
        editQuestion={selectedQuestion}
        isPending={createQuestionMutation.isPending || updateQuestionMutation.isPending}
      />
    </div>
  );
};

export default QuizDetail;