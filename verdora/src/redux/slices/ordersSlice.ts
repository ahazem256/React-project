import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../Types/Products";

interface CartItem extends Product {
  quantity: number;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

interface Order {
  id: string;
  orderDate: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: string;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'cancelled';
}

export interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action: { payload: Omit<Order, 'id' | 'orderDate' | 'status'> }) => {
      const newOrder: Order = {
        ...action.payload,
         id: `ORD-${Date.now()}`,
         orderDate: new Date().toISOString(),
        status: action.payload.paymentMethod === 'credit-card' ? 'confirmed' : 'pending',
      };
      state.orders.push(newOrder);
      state.currentOrder = newOrder;
    },
    setCurrentOrder: (state, action: { payload: string }) => {
      const order = state.orders.find(order => order.id === action.payload);
      state.currentOrder = order || null;
    },
    updateOrderStatus: (state, action: { payload: { orderId: string | number; status: Order['status'] } }) => {
      const orderIdStr = String(action.payload.orderId);
      const order = state.orders.find(order => String(order.id) === orderIdStr);
      if (order) {
        order.status = action.payload.status;
      }
      if (state.currentOrder && String(state.currentOrder.id) === orderIdStr) {
        state.currentOrder.status = action.payload.status;
      }
    },
    removeOrder: (state, action: { payload: string }) => {
      state.orders = state.orders.filter(order => order.id !== action.payload);
      // إذا كان الطلب المحذوف هو الطلب الحالي، امسحه
      if (state.currentOrder?.id === action.payload) {
        state.currentOrder = null;
      }
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearAllOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
    },
  },
});

export const { addOrder, setCurrentOrder, updateOrderStatus, removeOrder, clearCurrentOrder, clearAllOrders } = ordersSlice.actions;
export default ordersSlice.reducer;