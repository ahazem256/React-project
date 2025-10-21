import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../Types/Products";

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

// Load cart safely
const loadCart = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem("cart_items");
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    return [];
  }
};

// Save cart safely
const saveCart = (items: CartItem[]) => {
  localStorage.setItem("cart_items", JSON.stringify(items));
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
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
      saveCart(state.items);
    },

    removeFromCart: (state, action: { payload: number }) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },

    updateCartForUser: (state) => {
      // Reload cart on refresh or login
      state.items = loadCart();
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateCartForUser } =
  cartSlice.actions;
export default cartSlice.reducer;
