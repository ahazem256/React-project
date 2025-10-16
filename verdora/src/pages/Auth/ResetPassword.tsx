import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import authImg from "../../assets/download (6).jpeg";
import "../../styles/global.css";

interface ResetPasswordForm {
  newPassword: string;
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const email = location.state?.email;

  const schema = z.object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/^[A-Z][a-zA-Z0-9]{7,}$/, "Password must start with uppercase letter and be at least 8 chars"),
  });

  const { register, handleSubmit, formState } = useForm<ResetPasswordForm>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "" },
  });

  const onSubmit: SubmitHandler<ResetPasswordForm> = async ({ newPassword }) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/users?email=${email}`);
      const user = res.data[0];

      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        password: newPassword,
        resetCode: null,
      });

      toast.success("Password reset successfully!");
      navigate("/auth/signin");
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
            <h2 className="text-center mb-3 fw-bold">Reset Password</h2>
            <p className="text-center text-muted mb-4">Enter your new password for <strong>{email}</strong>.</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label fw-semibold">New Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    className={`form-control ${formState.errors.newPassword ? "is-invalid" : ""}`}
                    placeholder="New password"
                    {...register("newPassword")}
                  />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {formState.errors.newPassword && <div className="invalid-feedback d-block">{formState.errors.newPassword.message}</div>}
              </div>
              <button type="submit" className="btn w-100" disabled={isLoading} style={{ backgroundColor: "var(--color-green-darkest)" , color:"#fff"}}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-6 d-md-block">
          <img src={authImg} alt="Reset Password" className="img-fluid rounded" />
        </div>
      </div>
    </section>
  );
}
