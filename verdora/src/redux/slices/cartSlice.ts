import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../Types/Products";

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const getUserKey = () => {
  const userStr = localStorage.getItem("loggedInUser");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return `cart_items_${user.email}`;
    } catch {
      return "cart_items_guest";
    }
  }
  return "cart_items_guest";
};

const loadCart = (): CartItem[] => {
  try {
    const key = getUserKey();
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  const key = getUserKey();
  localStorage.setItem(key, JSON.stringify(items));
};

const initialState: CartState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: { payload: { product: Product; quantity: number } }) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
      saveCart(state.items);
    },
    removeFromCart: (state, action: { payload: number }) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },
    updateCartForUser: (state) => {
      state.items = loadCart();
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateCartForUser } = cartSlice.actions;
export default cartSlice.reducer;
