import { Formik as FormikComponent, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ArrowRight, User } from "lucide-react"; // Đổi icon User cho ô tên đăng nhập nhìn chuyên nghiệp hơn
import { useLogin } from "../api/useAuthMutations";

// Định nghĩa cấu trúc phản hồi từ hook useLogin/Axios tương ứng với API backend của bạn
interface LoginResponse {
  success: boolean;
  token: string;
  message: string;
  user: {
    id: string;
    username: string;
    admin: boolean; // Giá trị phân quyền kiểu Boolean thực tế từ Database
  };
}

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe?: boolean;
}

const INITIAL_VALUES: LoginFormValues = {
  username: "",
  password: "",
  rememberMe: false,
};

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .required("Tên đăng nhập không được để trống"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu không được để trống"),
});

export default function Login() {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();

  const getInputClass = (touched: boolean | undefined, error: string | undefined) => {
    return `form-control input-custom ${touched && error ? "is-invalid" : ""}`;
  };

  const handleSubmit = async (
    values: LoginFormValues,
    { resetForm }: FormikHelpers<LoginFormValues>
  ) => {
    if (values.rememberMe) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }
    const cleanUsername = values.username.trim();
    const cleanPassword = values.password.trim();

    login(
      { username: cleanUsername, password: cleanPassword },
      {
        onSuccess: (response: unknown) => {
          // Ép kiểu dữ liệu để đảm bảo lấy chuẩn các thuộc tính từ server
          const data = response as LoginResponse;
          
          // 1. Lưu trữ dữ liệu xác thực vào localStorage để bộ lọc Route kiểm tra
          localStorage.setItem("token", data.token);
          localStorage.setItem("isAdmin", String(data.user.admin)); // Ép kiểu boolean thành chuỗi 'true'/'false'

          resetForm();

          // 2. Điều hướng thông minh dựa trên thuộc tính admin trả về từ backend
          if (data.user.admin) {
            navigate("/dashboard", { replace: true }); // Admin chuyển đến không gian quản lý bài kiểm tra
          } else {
            navigate("/quiz-list", { replace: true }); // User thường chuyển thẳng đến giao diện danh sách làm bài
          }
        },
        onError: (err: unknown) => {
          alert((err as { message: string }).message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
        }
      }
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <section style={{ width: "100%", maxWidth: "420px" }}>
          {/* Card */}
          <div className="card" style={{ border: "1px solid #e4e1ee", borderRadius: "1rem", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)", backgroundColor: "#ffffff", padding: "40px 32px" }}>
            {/* Icon & Title */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "#ede9fe", borderRadius: "50%", marginBottom: "16px", width: "64px", height: "64px" }}>
                <Lock size={28} style={{ color: "#3b5bdb" }} />
              </div>
              <h1 className="h4 fw-bold" style={{ color: "#1b1b24", marginBottom: "8px" }}>Đăng Nhập</h1>
              <p className="small" style={{ color: "#464555", marginBottom: 0 }}>Nhập thông tin để truy cập tài khoản của bạn</p>
            </div>

            {/* Form */}
            <FormikComponent initialValues={INITIAL_VALUES} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ touched, errors }) => (
                <Form noValidate>
                  {/* Username */}
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label small fw-semibold" style={{ color: "#1b1b24" }}>Tên đăng nhập</label>
                    <div className="position-relative input-icon-wrapper">
                      <User size={18} className="input-icon text-muted" />
                      <Field
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Nhập tên đăng nhập"
                        className={getInputClass(touched.username, errors.username)}
                      />
                    </div>
                    <ErrorMessage name="username" component="div" className="invalid-feedback d-block mt-1" />
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <label htmlFor="password" className="form-label small fw-semibold m-0" style={{ color: "#1b1b24" }}>Mật khẩu</label>
                      <Link to="#" className="small text-decoration-none" style={{ color: "#3b5bdb", fontWeight: 500 }}>Quên mật khẩu?</Link>
                    </div>
                    <div className="position-relative input-icon-wrapper">
                      <Lock size={18} className="input-icon text-muted" />
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className={getInputClass(touched.password, errors.password)}
                      />
                    </div>
                    <ErrorMessage name="password" component="div" className="invalid-feedback d-block mt-1" />
                  </div>

                  {/* Remember Me Toggle */}
                  <div className="mb-4 d-flex align-items-center">
                    <Field
                      type="checkbox"
                      name="rememberMe"
                      id="rememberMe"
                      className="form-check-input me-2 shadow-none cursor-pointer"
                    />
                    <label htmlFor="rememberMe" className="form-check-label small text-secondary cursor-pointer select-none">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="btn btn-primary w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
                    style={{ background: "#3b5bdb", border: "none", borderRadius: "6px", padding: "12px 20px", minHeight: "40px", opacity: isPending ? 0.7 : 1, cursor: isPending ? "not-allowed" : "pointer" }}
                  >
                    <span>{isPending ? "Đang đăng nhập..." : "Đăng nhập"}</span>
                    {!isPending && <ArrowRight size={16} />}
                  </button>
                </Form>
              )}
            </FormikComponent>

            {/* Sign Up Link */}
            <div style={{ textAlign: "center", marginTop: "32px", paddingTop: "16px", borderTop: "1px solid #e4e1ee" }}>
              <p className="small" style={{ color: "#464555", marginBottom: 0 }}>
                Chưa có tài khoản?{" "}
                <Link to="/" className="fw-bold text-decoration-none" style={{ color: "#3b5bdb" }}>
                  Đăng ký miễn phí
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}