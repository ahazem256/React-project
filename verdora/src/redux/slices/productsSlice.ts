import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Product } from "../../Types/Products";

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

// ✅ الخطوة 1: جلب المنتجات من الـ API
export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://api.jsonbin.io/v3/b/68e56de5d0ea881f4098eaa4/latest"
      );

      // ✅ الـ data عندك داخل record.products
      const products = response.data.record.products;

      return products;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ الخطوة 2: الـ slice نفسه
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload instanceof String
            ? action.payload
            : "Failed to load products";
      });
  },
});

export default productsSlice.reducer;
