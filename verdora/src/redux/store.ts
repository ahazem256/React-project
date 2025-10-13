import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import ordersReducer from "./slices/ordersSlice"; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
});

// Persist selected slices to localStorage on any state change
store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem("cart_items", JSON.stringify(state.cart.items));
    localStorage.setItem(
      "orders_state",
      JSON.stringify({ orders: state.orders.orders, currentOrder: state.orders.currentOrder })
    );
  } catch {
    // ignore write errors
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
