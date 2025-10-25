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


const clearOldCarts = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("cart_items_")) {
      localStorage.removeItem(key);
    }
  });
};

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
    },
  },
});

export const { login, logout } = authSlice.actions;

export const logoutAndClearCart = () => (dispatch: AppDispatch) => {
  dispatch(logout());
  
  
  dispatch({ type: "cart/clearAllCartData" });
  
  clearOldCarts();
};


export const switchUser = (userData: { token: string; user: User }) => (dispatch: AppDispatch) => {
  
  dispatch(login(userData));
  
  // Update the cart
  dispatch({ type: "cart/updateCartForUser" });
};

export default authSlice.reducer;