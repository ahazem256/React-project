import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import authImg from "../../assets/download (6).jpeg";
import "../../styles/global.css";

interface VerifyCodeForm {
  resetCode: string;
}

export default function VerifyResetCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("Email is missing! Redirecting...");
      navigate("/auth/forget-password");
    }
  }, [email, navigate]);

  const schema = z.object({
    resetCode: z.string().length(6, "Reset code must be 6 digits"),
  });

  const { register, handleSubmit, formState } = useForm<VerifyCodeForm>({
    resolver: zodResolver(schema),
    defaultValues: { resetCode: "" },
  });

  const onSubmit: SubmitHandler<VerifyCodeForm> = async ({ resetCode }) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5005/users?email=${email}`);
      const user = res.data[0];

      if (user.resetCode !== resetCode) {
        toast.error("Invalid reset code!");
        return;
      }

      toast.success("Code verified successfully!");
      navigate("/auth/reset-password", { state: { email } });
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: "#fff" , fontFamily: "var(--font-family-form)"}}>
      <div className="row w-100 justify-content-center align-items-center" style={{ maxWidth: "900px" }}>
        <div className="col-md-6">
          <div className="card p-4">
            <h2 className="text-center mb-3 fw-bold">Verify Reset Code</h2>
            <p className="text-center text-muted mb-4">
              Please enter the reset code sent to your email: <strong>{email}</strong>
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3" >
                <label htmlFor="resetCode" className="form-label fw-semibold">Reset Code</label>
                <input
                  type="text"
                  id="resetCode"
                  className={`form-control ${formState.errors.resetCode ? "is-invalid" : ""}`}
                  placeholder="Enter 6-digit code"
                  {...register("resetCode")}
                />
                {formState.errors.resetCode && (
                  <div className="invalid-feedback">{formState.errors.resetCode.message}</div>
                )}
              </div>
              <button type="submit" className="btn  w-100" disabled={isLoading} style={{ backgroundColor: "var(--color-green-darkest)", color:"#fff"}}>
                {isLoading ? "Verifying..." : "Verify Code"}
              </button>
              <p className="text-center mt-3 mb-0">
                Didn't receive a code?{" "}
                <span
                  onClick={() => navigate("/auth/forget-password")}
                  className="fw-semibold text-success"
                  style={{ cursor: "pointer", textDecoration: "none" }}
                >
                  Request a new one
                </span>
              </p>
            </form>
          </div>
        </div>
        <div className="col-md-6 d-md-block">
          <img src={authImg} alt="Verify Reset Code" className="img-fluid rounded" />
        </div>
      </div>
    </section>
  );
}
