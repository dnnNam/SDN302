import { Formik as FormikComponent, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
// Import các icon cần thiết từ lucide-react
import { User, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { useRegister } from "../api/useAuthMutations";


interface RegisterFormValues {
  username: string;
  password: string;
}

const INITIAL_VALUES: RegisterFormValues = {
  username: "",
  password: "",
};

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .max(20, "Tên đăng nhập không vượt quá 20 ký tự")
    .required("Tên đăng nhập không được để trống"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu không được để trống"),
});

export default function Register() {
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegister();

  const getInputClass = (touched: boolean | undefined, error: string | undefined) => {
    return `form-control input-custom ${touched && error ? "is-invalid" : ""}`;
  };

  const handleSubmit = async (
    values: RegisterFormValues,
    { resetForm }: FormikHelpers<RegisterFormValues>
  ) => {
    register(values, {
      onSuccess: () => {
        resetForm();
        navigate("/login");
      },
    });
  };

  return (
    <div className="register-wrapper d-flex flex-column min-vh-100">
      
   
     

      {/* Main Content Area */}
      <main className="container flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="row w-100 align-items-center g-5 layout-grid">
          
          {/* Left Column */}
          <section className="col-lg-6 d-none d-lg-block text-start">
            <span className="badge-custom mb-3 d-inline-flex align-items-center gap-1">
              <ShieldCheck size={14} /> SẴN SÀNG CHO DOANH NGHIỆP
            </span>
            <h1 className="display-6 fw-bold text-dark lh-sm mb-3 main-title">
              Xây dựng trắc nghiệm chuyên nghiệp trong <span className="text-primary">vài phút</span>.
            </h1>
            <p className="text-muted mb-4 subtitle-text">
              Hơn 10,000+ chuyên gia HR và giáo viên tin dùng QuizMaster Pro cho các kỳ đánh giá.
            </p>

           
          </section>

          {/* Right Column: Card Form */}
          <section className="col-lg-6 d-flex justify-content-center">
            <div className="card shadow-sm border-0 rounded-4 p-4 register-card-custom">
              <div className="text-center mb-4">
                <h3 className="fw-bold form-title">Tạo tài khoản mới</h3>
                <p className="text-muted small">Điền thông tin để bắt đầu dùng thử 14 ngày miễn phí.</p>
              </div>

              <FormikComponent
                initialValues={INITIAL_VALUES}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ touched, errors }) => (
                  <Form noValidate>
                    {/* Username Input với Icon lồng bên trong */}
                    <div className="mb-3 text-start">
                      <label htmlFor="username" className="form-label small fw-semibold text-secondary">Tên đăng nhập</label>
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

                    {/* Password Input với Icon lồng bên trong */}
                    <div className="mb-4 text-start">
                      <label htmlFor="password" className="form-label small fw-semibold text-secondary">Mật khẩu</label>
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

                    {/* Button Đăng ký kèm Icon mũi tên */}
                    <button 
                      type="submit" 
                      disabled={isPending}
                      className="btn btn-primary w-100 mb-3 d-flex align-items-center justify-content-center gap-2" 
                      style={{ background: '#3b5bdb', borderRadius: '6px', padding: '12px 20px', minHeight: '40px', opacity: isPending ? 0.7 : 1, cursor: isPending ? 'not-allowed' : 'pointer' }}
                    >
                      <span>{isPending ? 'Đang đăng ký...' : 'Đăng ký ngay'}</span>
                      {!isPending && <ArrowRight size={16} />}
                    </button>

                    {/* Footer Text */}
                    <p className="text-center small mb-0" style={{ color: '#3b5bdb' }}>
                      Đã có tài khoản?{" "}
                      <Link to="/login" className="fw-bold text-decoration-none" style={{ color: '#3b5bdb' }}>Đăng nhập</Link>
                    </p>
                  </Form>
                )}
              </FormikComponent>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}