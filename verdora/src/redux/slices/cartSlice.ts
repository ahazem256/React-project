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

        if (product.stock === 0) {
    alert("This product is out of stock and cannot be added to the cart.");
    return; 
  }


     const existingItem = state.items.find(item => item.id === product.id);

  if (existingItem) {
    if (existingItem.quantity + quantity > product.stock) {
      alert("Not enough stock available for this product.");
      return state;
    }
    existingItem.quantity += quantity;
  } else {
    if (quantity > product.stock) {
      alert("Not enough stock available for this product.");
      return state;
    }
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
