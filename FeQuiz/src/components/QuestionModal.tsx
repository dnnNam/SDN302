import React, { useState } from 'react';
import type { Question } from '../types/api.type';


interface QuestionModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: Partial<Question>) => void;
  editQuestion: Question | null;
  isPending: boolean;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ show, onClose, onSave, editQuestion, isPending }) => {
  // Khởi tạo trực tiếp State từ Props. Cơ chế hủy-tái tạo (Remount) theo Key sẽ đảm đương việc làm mới form.
  const [questionText, setQuestionText] = useState(
    editQuestion ? (editQuestion.text || editQuestion.question || '') : ''
  );
  
  const [options, setOptions] = useState<string[]>(
    editQuestion?.options && editQuestion.options.length > 0 
      ? [...editQuestion.options] 
      : ['', '', '', ''] // Khi bấm Tạo mới form sẽ hiển thị sẵn 4 ô trống
  );
  
  const [correctIndex, setCorrectIndex] = useState<number>(
    editQuestion ? (editQuestion.correctAnswerIndex ?? editQuestion.correctAnswer ?? 0) : 0
  );

  if (!show) return null;

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      alert('Một câu hỏi trắc nghiệm phải có tối thiểu 2 lựa chọn!');
      return;
    }
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);

    if (correctIndex === index) {
      setCorrectIndex(0);
    } else if (correctIndex > index) {
      setCorrectIndex(correctIndex - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionText.trim()) {
      return alert('Vui lòng nhập nội dung câu hỏi!');
    }

    const hasEmptyOption = options.some(opt => !opt.trim());
    if (hasEmptyOption) {
      return alert('Vui lòng điền đầy đủ nội dung cho tất cả các phương án lựa chọn!');
    }

    onSave({
      text: questionText,
      question: questionText,
      options: options.map(opt => opt.trim()),
      correctAnswerIndex: correctIndex,
      correctAnswer: correctIndex
    });
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={onClose}></div>
      
      <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1051 }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '14px' }}>
            
            <div className="modal-header border-bottom border-light">
              <h5 className="modal-title fw-bold text-dark">
                {editQuestion ? 'Chỉnh sửa câu hỏi' : 'Tạo câu hỏi mới'}
              </h5>
              <button type="button" className="btn-close shadow-none" onClick={onClose} disabled={isPending}></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                
                {/* Nội dung câu hỏi */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary">Nội dung câu hỏi</label>
                  <textarea 
                    className="form-control border-light-subtle bg-light bg-opacity-50 fw-medium" 
                    rows={3} 
                    placeholder="Nhập nội dung câu hỏi trắc nghiệm tại đây..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    disabled={isPending}
                  />
                </div>

                {/* Các phương án lựa chọn */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label small fw-bold text-secondary m-0">Các phương án trả lời & Đáp án đúng</label>
                    <button 
                      type="button" 
                      className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1 rounded-2 border-0 fw-semibold"
                      onClick={handleAddOption}
                      disabled={isPending}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
                      Thêm lựa chọn
                    </button>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    {options.map((option, index) => (
                      <div key={index} className="d-flex align-items-center gap-2">
                        
                        <div className="form-check m-0 p-0 d-flex align-items-center justify-content-center">
                          <input
                            className="form-check-input m-0 ms-2"
                            type="radio"
                            name="correctAnswerRadio"
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            checked={correctIndex === index}
                            onChange={() => setCorrectIndex(index)}
                            disabled={isPending}
                          />
                        </div>

                        <span className="fw-bold text-secondary px-2">{String.fromCharCode(65 + index)}.</span>

                        <input
                          type="text"
                          className={`form-control border-light-subtle ${correctIndex === index ? 'bg-success bg-opacity-10 border-success border-opacity-25 fw-medium text-success-emphasis' : 'bg-light bg-opacity-50'}`}
                          placeholder={`Nhập nội dung lựa chọn ${String.fromCharCode(65 + index)}...`}
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          disabled={isPending}
                        />

                        <button
                          type="button"
                          className="btn btn-light text-danger p-2 d-inline-flex align-items-center border-0 rounded-3 bg-opacity-70"
                          onClick={() => handleRemoveOption(index)}
                          disabled={isPending || options.length <= 2}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete_outline</span>
                        </button>

                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-muted small d-flex align-items-center gap-1 mt-3">
                  <span className="material-symbols-outlined text-info" style={{ fontSize: '16px' }}>info</span>
                  Tích chọn nút tròn ở phía trước chữ cái đầu để xác định phương án đó là đáp án chính xác.
                </div>

              </div>

              <div className="modal-footer border-top border-light">
                <button type="button" className="btn btn-light px-3 fw-medium text-secondary border-0" onClick={onClose} disabled={isPending}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary px-4 fw-medium" disabled={isPending}>
                  {isPending && <span className="spinner-border spinner-border-sm me-2" role="status"></span>}
                  Lưu dữ liệu
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionModal;