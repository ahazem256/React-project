import { useFormik } from "formik";
import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/slices/authSlice";
import auth from '../../assets/download (6).jpeg'
import "../../styles/global.css"

interface ResetPasswordValues {
  email: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  token?: string;
  message?: string;
}

const ResetPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ResetPasswordSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    newPassword: Yup.string()
      .matches(
        /^[A-Z][a-zA-Z0-9]{7,}$/,
        "Password must start with an uppercase letter and be at least 8 characters long"
      )
      .required("Password is required"),
  });

  const formik = useFormik<ResetPasswordValues>({
    initialValues: {
      email: "",
      newPassword: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: (values) => resetPassword(values),
  });

  async function resetPassword(values: ResetPasswordValues): Promise<void> {
    setIsLoading(true);
    setErrorMsg(""); // Clear previous errors
    
    try {
      const { data } = await axios.put<ResetPasswordResponse>(
        `https://ecommerce.routemisr.com/api/v1/auth/resetPassword`,
        values
      );

      if (data.token) {
        dispatch(setToken(data.token));
        navigate("/auth/signin");
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <Helmet>
        <link rel="stylesheet" href="/path/to/Nib.woff2" />
        <title>Verdora - Reset Password</title>
      </Helmet>
      
      <section
        className="d-flex align-items-center justify-content-center min-vh-100"
        style={{ backgroundColor: "#fff" }}
      >
        <div
          className="row w-100 justify-content-center align-items-center"
          style={{ maxWidth: "900px" }}
        >
          {/* Form */}
          <div className="col-md-6">
            <div className="card p-4" style={{ border: "none", fontFamily: "var(--font-family-form)" }}>
              <h2 className="text-center mb-3 fw-bold">Reset Password</h2>
              <p className="text-center text-muted mb-4">
                Enter your email and new password to reset it.
              </p>
              <form onSubmit={formik.handleSubmit}>
                {/* Email Field */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${
                      formik.touched.email && formik.errors.email ? "is-invalid" : ""
                    }`}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{ fontFamily: "var(--font-family-form)" }}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback" style={{ fontFamily: "var(--font-family-form)" }}>
                      {formik.errors.email}
                    </div>
                  )}
                </div>
                {/* Password Field */}
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label fw-semibold">
                    New Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      className={`form-control ${
                        formik.touched.newPassword && formik.errors.newPassword
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formik.values.newPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      style={{ fontFamily: "var(--font-family-form)" }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ fontFamily: "var(--font-family-form)" }}
                    >
                      <i
                        className={`fa-regular ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </button>
                  </div>
                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <div className="invalid-feedback d-block" style={{ fontFamily: "var(--font-family-form)" }}>
                      {formik.errors.newPassword}
                    </div>
                  )}
                </div>
                {/* Error Message */}
                {errorMsg && (
                  <div className="alert alert-danger text-center py-2" style={{ fontFamily: "var(--font-family-form)" }}>
                    {errorMsg}
                  </div>
                )}
                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={isLoading || !(formik.dirty && formik.isValid)}
                  style={{ fontFamily: "var(--font-family-form)" }}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
                {/* Sign in Link */}
                <p className="text-center mt-3 mb-0" style={{ fontFamily: "var(--font-family-form)" }}>
                  Remember your password?{" "}
                  <a
                    onClick={() => navigate("/auth/signin")}
                    className="fw-semibold text-success"
                    style={{ cursor: "pointer", textDecoration: "none" }}
                  >
                    Sign in here
                  </a>
                </p>
              </form>
            </div>
          </div>
          {/* Image */}
          <div className="col-md-6 d-md-block">
            <img
              src={auth}
              alt="Reset Password"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPassword;