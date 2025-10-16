// src/mockAuthAPI.ts
import axios from "axios";

const API_URL = "http://localhost:5000/users";

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  phone?: string;
  resetCode?: string | null;
}

export const mockAuthAPI = {
  // Sign In
  signIn: async (email: string, password: string) => {
    const res = await axios.get(`${API_URL}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    const user = res.data[0];
    if (!user) throw new Error("Incorrect email or password");

    const token = `mock-token-${user.id}-${Date.now()}`;
    return { message: "success", token, user };
  },

  // Sign Up
  signUp: async (userData: { name: string; email: string; password: string; phone?: string }) => {
    const existing = await axios.get(`${API_URL}?email=${encodeURIComponent(userData.email)}`);
    if (existing.data.length > 0) throw new Error("Email already exists");

    const res = await axios.post(API_URL, { ...userData, role: "user", resetCode: null });
    return { message: "success", user: res.data };
  },

  // Forgot Password: generates resetCode and stores it on the user
  forgotPassword: async (email: string) => {
    const res = await axios.get(`${API_URL}?email=${encodeURIComponent(email)}`);
    const user = res.data[0];
    if (!user) throw new Error("Email not found");

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    await axios.patch(`${API_URL}/${user.id}`, { resetCode });
    console.log(`Reset code for ${email}: ${resetCode}`); // for testing
    return { statusMsg: "success", resetCode }; // returning code helps testing
  },

  // Verify Reset Code (requires email and code)
  verifyResetCode: async (email: string, code: string) => {
    const res = await axios.get(`${API_URL}?email=${encodeURIComponent(email)}&resetCode=${encodeURIComponent(code)}`);
    const user = res.data[0];
    if (!user) throw new Error("Invalid reset code");
    return { status: "Success" };
  },

  // Reset Password (email + newPassword)
  resetPassword: async (email: string, newPassword: string) => {
    const res = await axios.get(`${API_URL}?email=${encodeURIComponent(email)}`);
    const user = res.data[0];
    if (!user || !user.resetCode) throw new Error("Invalid request or code missing");

    await axios.patch(`${API_URL}/${user.id}`, { password: newPassword, resetCode: null });
    const token = `mock-token-${user.id}-${Date.now()}`;
    return { token };
  },

  // helper to get all users (for admin page)
  getAllUsers: async () => {
    const res = await axios.get<User[]>(API_URL);
    return res.data;
  }
};
