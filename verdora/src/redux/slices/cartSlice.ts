import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../Types/Products";

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

// Hydrate cart from localStorage (simple persistence)
const savedCartItems: CartItem[] = (() => {
  try {
    const raw = localStorage.getItem("cart_items");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
})();

const initialState: CartState = {
  items: savedCartItems,
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
    },
    removeFromCart: (state, action: { payload: number }) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
