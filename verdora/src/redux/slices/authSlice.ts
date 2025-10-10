import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  userName: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  userName: localStorage.getItem("userName"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.userName = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
    },
  },
});

export const { setToken, setUserName, logout } = authSlice.actions;
export default authSlice.reducer;
