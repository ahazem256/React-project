import axios from "axios";

const API_URL = "http://localhost:5000/users";

export const mockAuthAPI = {
  signIn: async (email: string, password: string) => {
    const res = await axios.get(`${API_URL}?email=${email}&password=${password}`);
    const user = res.data[0];
    if (!user) throw new Error("Incorrect email or password");
    const token = `mock-token-${user.id}-${Date.now()}`;
    return { message: "success", token, user };
  },

  signUp: async (userData: { name: string; email: string; password: string }) => {
    const existing = await axios.get(`${API_URL}?email=${userData.email}`);
    if (existing.data.length > 0) throw new Error("Email already exists");
    const res = await axios.post(API_URL, { ...userData, role: "user", resetCode: null });
    return { message: "success", user: res.data };
  },

  forgotPassword: async (email: string) => {
    const res = await axios.get(`${API_URL}?email=${email}`);
    const user = res.data[0];
    if (!user) throw new Error("Email not found");

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    await axios.patch(`${API_URL}/${user.id}`, { resetCode });
    console.log(`Reset code for ${email}: ${resetCode}`);
    return { statusMsg: "success" };
  },

  verifyResetCode: async (email: string, code: string) => {
    const res = await axios.get(`${API_URL}?email=${email}&resetCode=${code}`);
    const user = res.data[0];
    if (!user) throw new Error("Invalid reset code");
    return { status: "Success" };
  },

  resetPassword: async (email: string, newPassword: string) => {
    const res = await axios.get(`${API_URL}?email=${email}`);
    const user = res.data[0];
    if (!user || !user.resetCode) throw new Error("Invalid request");

    await axios.patch(`${API_URL}/${user.id}`, { password: newPassword, resetCode: null });
    const token = `mock-token-${user.id}-${Date.now()}`;
    return { token };
  }
};
