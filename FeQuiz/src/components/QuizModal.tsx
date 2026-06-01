import React, { useState } from 'react'; // Không cần import useEffect nữa
import { useCreateQuiz, useUpdateQuiz } from '../api/useQuizHooks';
import type { Quiz } from '../types/api.type';

interface ApiError {
  message: string;
}

interface QuizPayload {
  title: string;
  description: string;
}

interface QuizModalProps {
  show: boolean;
  onClose: () => void;
  editQuiz: Quiz | null;
}

const QuizModal: React.FC<QuizModalProps> = ({ show, onClose, editQuiz }) => {

  const [title, setTitle] = useState(editQuiz?.title || '');
  const [description, setDescription] = useState(editQuiz?.description || '');

  

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  const createQuizMutation = useCreateQuiz();
  const updateQuizMutation = useUpdateQuiz();

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Vui lòng điền đầy đủ tiêu đề và mô tả bài trắc nghiệm (*)');
      return;
    }

    const quizData: QuizPayload = {
      title: title.trim(),
      description: description.trim(),
    };

    if (editQuiz) {
      updateQuizMutation.mutate(
        { id: editQuiz._id, data: quizData },
        {
          onSuccess: () => {
            alert('Cập nhật bài trắc nghiệm thành công!');
            handleClose();
          },
          onError: (err: Error | ApiError) => {
            alert(err.message || 'Cập nhật thất bại');
          },
        }
      );
    } else {
      createQuizMutation.mutate(quizData, {
        onSuccess: () => {
          alert('Thêm bài trắc nghiệm mới thành công!');
          handleClose();
        },
        onError: (err: Error | ApiError) => {
          alert(err.message || 'Thêm mới thất bại');
        },
      });
    }
  };

  const isPending = createQuizMutation.isPending || updateQuizMutation.isPending;

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{
        backgroundColor: 'rgba(27, 27, 36, 0.5)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '16px' }}>
          <div className="modal-header border-bottom p-4 bg-light bg-gradient">
            <div>
              <h5 className="modal-title fw-bold text-primary h4">
                {editQuiz ? 'Chỉnh sửa bài trắc nghiệm' : 'Thêm bài trắc nghiệm mới'}
              </h5>
              <p className="text-muted small m-0">
                Thiết lập thông tin cốt lõi cho bài đánh giá
              </p>
            </div>

            <button
              type="button"
              className="btn-close shadow-none"
              onClick={handleClose}
              disabled={isPending}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary small">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  className="form-control py-2 shadow-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isPending}
                />
              </div>

              <div className="mb-2">
                <label className="form-label fw-semibold text-secondary small">
                  Mô tả *
                </label>
                <textarea
                  className="form-control shadow-none"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="modal-footer border-top p-3 bg-light bg-gradient">
              <button
                type="button"
                className="btn btn-link text-secondary"
                onClick={handleClose}
                disabled={isPending}
              >
                Hủy bỏ
              </button>

              <button type="submit" className="btn btn-primary px-4" disabled={isPending}>
                {isPending ? 'Đang xử lý...' : editQuiz ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;