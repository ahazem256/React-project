import { useState } from "react";
import Fabricimag from "../../assets/download__8_-removebg-preview.png";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../../styles/global.css";
import { Helmet } from "react-helmet";

interface FormValues {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
  termsAccepted: boolean;
}

export default function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [apiError, setAPIError] = useState <string>("");

  const schema = z
    .object({
      name: z.string().min(1, "Name is required").max(10, "Max length is 10"),
      email: z.string().email("Invalid email"),
      password: z
        .string()
        .regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, "Invalid password"),
      rePassword: z.string(),
      phone: z
        .string()
        .min(1, "Phone number is required")
        .refine(
          (value) =>
            /^01[0-2,5][0-9]{8}$/.test(value) ||
            /^\+201[0-2,5][0-9]{8}$/.test(value) ||
            /^\+\d{10,15}$/.test(value),
          { message: "Invalid phone number" }
        ),
      termsAccepted: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),
    })

    .refine((obj) => obj.password === obj.rePassword, {
      message: "Passwords do not match",
      path: ["rePassword"],
    });

  console.log("render SignUp");
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
      termsAccepted: false,
    },
    resolver: zodResolver(schema),
  });

  const { register, handleSubmit, formState } = form;

  const handleRegister: SubmitHandler<FormValues> = async (
    values: FormValues
  ) => {
    setIsLoading(true);

    // const { termsAccepted, ...payload } = values;

    try {
      const result = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/auth/signup`,
        values
      );
      console.log(result.data.message);
      if (result.data.message == "success") {
        toast.success("Registration successful!");
        navigate("/auth/signin");
      }
      setIsLoading(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong!";
        toast.error(message);
      } else {
        toast.error("Unexpected error!");
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Verdora - Register</title>
        <link rel="stylesheet" href="/path/to/Nib.woff2" />
        <meta name="description" content="Register page for Verdora" />
      </Helmet>

      <div
        className="register-page"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div className="mt-5" style={{ fontFamily: "var(--font-family-form)" }}>
          <form
            style={{ width: "25vw", padding: "30px" }}
            onSubmit={handleSubmit(handleRegister)}
          >
            <h1
              style={{
                display: "block",
                textAlign: "center",
                color: "#030303ff",
              }}
              className="mb-5"
            >
              Sign up
            </h1>
            {/* Name */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control p-3 rounded-0"
                id="name"
                placeholder="Enter your name"
                {...register("name")}
              />
              {formState.errors.name && formState.touchedFields.name ? (
                <p className="alert alert-danger p-1 mt-1">
                  {formState.errors.name.message}
                </p>
              ) : null}
            </div>
            {/* Email */}
            <div className="mb-3">
              <input
                type="email"
                className="form-control p-3 rounded-0"
                id="email"
                placeholder="Enter your email"
                {...register("email")}
              />
              {formState.errors.email && formState.touchedFields.email ? (
                <p className="alert alert-danger p-1 mt-1">
                  {formState.errors.email.message}
                </p>
              ) : null}
            </div>
            {/* Password */}
            <div className="mb-3">
              <input
                type="password"
                className="form-control p-3 rounded-0"
                id="password"
                placeholder="Enter your password"
                {...register("password")}
              />
              {formState.errors.password && formState.touchedFields.password ? (
                <p className="alert alert-danger p-1 mt-1">
                  {formState.errors.password.message}
                </p>
              ) : null}
            </div>
            {/* Repassword */}
            <div className="mb-3">
              <input
                type="password"
                className="form-control p-3 rounded-0"
                id="rePassword"
                placeholder="Re-enter your password"
                {...register("rePassword")}
              />
              {formState.errors.rePassword &&
              formState.touchedFields.rePassword ? (
                <p className="alert alert-danger p-1 mt-1">
                  {formState.errors.rePassword.message}
                </p>
              ) : null}
            </div>

            <div className="mb-3">
              <input
                type="tel"
                className="form-control p-3 rounded-0"
                id="phone"
                placeholder="Enter your phone"
                {...register("phone")}
              />
              {formState.errors.phone && formState.touchedFields.phone ? (
                <p className="alert alert-danger p-1 mt-1">
                  {formState.errors.phone.message}
                </p>
              ) : null}
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
                {...register("termsAccepted")}
              />
              <label
                className="form-check-label"
                htmlFor="exampleCheck1"
                style={{ display: "block", textAlign: "left" }}
              >
                I agree to all the statments
              </label>
              {formState.errors.termsAccepted ? (
                <p className="alert alert-danger p-1 mt-1">
                  {formState.errors.termsAccepted.message}
                </p>
              ) : null}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-success w-100 rounded-3 p-3 fs-5"
              disabled={isLoading}
              style={{ background: "var(--color-green-darkest)" }}
            >
              {isLoading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                "Register"
              )}
            </button>
          </form>
        </div>

        <div style={{ flexShrink: 0 }}>
          <img
            src={Fabricimag}
            style={{ height: "100%", objectFit: "cover", marginTop: "-30px" }}
          />
        </div>
      </div>
    </>
  );
}