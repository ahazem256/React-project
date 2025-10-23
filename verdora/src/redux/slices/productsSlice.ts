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


export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5005/products");
      
      console.log("🟢 API Response:", response.data);
      
      
      const productsWithStringIds = response.data.map((product: any) => ({
        ...product,
        id: String(product.id) 
      }));

      console.log("✅ Products with string IDs:", productsWithStringIds.map(p => ({ id: p.id, name: p.name })));
      
      return productsWithStringIds;
    } catch (error: any) {
      console.error("❌ Error fetching products:", error);
      return rejectWithValue(error.message || "Failed to load products");
    }
  }
);


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
        console.log("🟢 Products loaded successfully:", action.payload.length);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to load products";
        console.error("❌ Products loading failed:", action.payload);
      });
  },
});

export default productsSlice.reducer;