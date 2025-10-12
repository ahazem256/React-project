import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
import authImg from "../../assets/download (6).jpeg";
import "../../styles/global.css";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/slices/authSlice";

interface SignInFormValues {
  email: string;
  password: string;
}

interface SignInProps {
  onLogin: (token: string, name: string) => void;
}

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignIn({ onLogin }: SignInProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const { register, handleSubmit, formState } = form;

  const onSubmit: SubmitHandler<SignInFormValues> = async (values) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signin",
        values
      );

      if (data.message === "success") {
        const token = data.token;


        const storedUserData = JSON.parse(localStorage.getItem("userData") || "{}");

        const userName =
          storedUserData?.name?.Name ||
          storedUserData?.name ||
          data.user?.name ||
          "User";

        localStorage.setItem("token", token);
        localStorage.setItem("userName", userName);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...storedUserData,
            name: storedUserData.name || { Name: userName },
          })
        );

        dispatch(setToken(token));
        onLogin(token, userName);

        toast.success(`Welcome back, ${userName}!`);
        navigate("/home", { replace: true });
      }

    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "Sign in failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Verdora - Sign In</title>
      </Helmet>
      <div
        className="d-flex align-items-center justify-content-center min-vh-100"
        style={{ backgroundColor: "#fff" }}
      >
        <div
          className="row w-100 justify-content-center align-items-center"
          style={{ maxWidth: "900px" }}
        >
          {/* Form */}
          <div className="col-md-6">
            <div
              className="card p-4"
              style={{
                border: "none",
                fontFamily: "var(--font-family-form)",
              }}
            >
              <h2
                className="text-center mb-3"
                style={{
                  fontFamily: "var(--font-family-serif)",
                  color: "var(--color-green-darkest)",
                }}
              >
                Sign In
              </h2>
              <p className="text-center text-muted mb-4">
                Welcome back! Please sign in to your account.
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email */}
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="form-label fw-semibold"
                    style={{
                      fontFamily: "var(--font-family-serif)",
                      color: "var(--color-green-darkest)",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`form-control p-3 rounded-0 ${formState.errors.email && formState.touchedFields.email
                      ? "is-invalid"
                      : ""
                      }`}
                    placeholder="Enter your email"
                    {...register("email")}
                  />
                  {formState.errors.email &&
                    formState.touchedFields.email && (
                      <div className="invalid-feedback">
                        {formState.errors.email.message}
                      </div>
                    )}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="form-label fw-semibold"
                    style={{
                      fontFamily: "var(--font-family-serif)",
                      color: "var(--color-green-darkest)",
                    }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className={`form-control p-3 rounded-0 ${formState.errors.password &&
                      formState.touchedFields.password
                      ? "is-invalid"
                      : ""
                      }`}
                    placeholder="Enter your password"
                    {...register("password")}
                  />
                  {formState.errors.password &&
                    formState.touchedFields.password && (
                      <div className="invalid-feedback">
                        {formState.errors.password.message}
                      </div>
                    )}
                </div>

                {/* Forgot password */}
                <div className="mb-3 text-end">
                  <a
                    href="#"
                    className="text-success fw-semibold"
                    style={{ textDecoration: "none" }}
                    onClick={() => navigate("/auth/forget-password")}
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn w-100"
                  disabled={isLoading}
                  style={{
                    fontFamily: "var(--font-family-form)",
                    backgroundColor: "var(--color-green-darkest)",
                  }}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Register link */}
              <p
                className="text-center mt-3 mb-0"
                style={{ fontFamily: "var(--font-family-form)" }}
              >
                Don't have an account?{" "}
                <a
                  onClick={() => navigate("/auth/signup")}
                  className="fw-semibold text-success"
                  style={{ cursor: "pointer", textDecoration: "none" }}
                >
                  Register
                </a>
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="col-md-6 d-md-block">
            <img src={authImg} alt="Sign In" className="img-fluid rounded" />
          </div>
        </div>
      </div>
    </>
  );
}
