import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store"; 

interface User {
  email: string;
  userName: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: localStorage.getItem("loggedInUser")
    ? JSON.parse(localStorage.getItem("loggedInUser")!)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("loggedInUser", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("loggedInUser");

      // remove all cart keys when user logs out
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("cart_items_")) {
          localStorage.removeItem(key);
        }
      });
    },
  },
});

export const { login, logout } = authSlice.actions;

// ✅ optional thunk to fully clear everything including cart slice state
export const logoutAndClearCart = () => (dispatch: AppDispatch) => {
  dispatch(logout()); // clear auth
  // clear cart state by dispatching from cartSlice
  dispatch({ type: "cart/clearAllCartData" });
};

export default authSlice.reducer;
