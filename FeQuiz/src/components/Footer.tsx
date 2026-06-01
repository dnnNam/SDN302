import { Link } from "react-router-dom";


export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="small mb-0" style={{ color: '#3b5bdb' }}>
            © 2024 QuizMaster Pro. Tất cả quyền được bảo lưu.
          </p>

          <div className="d-flex gap-4">
            <Link
              to="/privacy"
              className="small text-decoration-none"
              style={{ color: '#3b5bdb' }}
            >
              Bảo mật
            </Link>

            <Link
              to="/terms"
              className="small text-decoration-none"
              style={{ color: '#3b5bdb' }}
            >
              Điều khoản
            </Link>

            <Link
              to="/support"
              className="small text-decoration-none"
              style={{ color: '#3b5bdb' }}
            >
              Hỗ trợ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
