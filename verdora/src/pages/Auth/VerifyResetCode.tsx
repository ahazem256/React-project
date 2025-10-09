import { useFormik } from "formik";
import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import auth from '../../assets/download (6).jpeg'
import "../../styles/global.css"

interface VerifyResetCodeValues {
  resetCode: string;
}

interface VerifyResetCodeResponse {
  status: string;
  message?: string;
}

const VerifyResetCode: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const verifyResetCodeSchema = Yup.object({
    resetCode: Yup.string().required("Reset code is required"),
  });

  const formik = useFormik<VerifyResetCodeValues>({
    initialValues: {
      resetCode: "",
    },
    validationSchema: verifyResetCodeSchema,
    onSubmit: (values) => {
      verifyResetCode(values);
    },
  });

  async function verifyResetCode(values: VerifyResetCodeValues): Promise<void> {
    setIsLoading(true);
    setErrorMsg(null); // Clear previous errors
    
    try {
      const { data } = await axios.post<VerifyResetCodeResponse>(
        "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
        values
      );

      if (data.status === "Success") {
        navigate("/auth/reset-password");
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
        <title>Verdora - Verify Reset Code</title>
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
              <h2 className="text-center mb-3 fw-bold">Verify Reset Code</h2>
              <p className="text-center text-muted mb-4">
                Please enter the reset code sent to your email.
              </p>
              <form onSubmit={formik.handleSubmit}>
                {/* Reset Code Field */}
                <div className="mb-3">
                  <label htmlFor="resetCode" className="form-label fw-semibold">
                    Reset Code
                  </label>
                  <input
                    type="text"
                    id="resetCode"
                    name="resetCode"
                    className={`form-control ${
                      formik.touched.resetCode && formik.errors.resetCode
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.resetCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{ fontFamily: "var(--font-family-form)" }}
                    placeholder="Enter the 6-digit code"
                  />
                  {formik.touched.resetCode && formik.errors.resetCode && (
                    <div className="invalid-feedback" style={{ fontFamily: "var(--font-family-form)" }}>
                      {formik.errors.resetCode}
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
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </button>

                {/* Request New Code Link */}
                <p className="text-center mt-3 mb-0" style={{ fontFamily: "var(--font-family-form)" }}>
                  Didn't receive a code?{" "}
                  <a
                    onClick={() => navigate("/auth/forget-password")}
                    className="fw-semibold text-success"
                    style={{ cursor: "pointer", textDecoration: "none" }}
                  >
                    Request a new one
                  </a>
                </p>
              </form>
            </div>
          </div>
          {/* Image */}
          <div className="col-md-6 d-md-block">
            <img
              src={auth}
              alt="Verify Reset Code"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default VerifyResetCode;