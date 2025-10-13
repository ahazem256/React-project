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
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
}

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
}

// Hydrate orders from localStorage (simple persistence)
const savedOrdersState: Partial<OrdersState> = (() => {
  try {
    const raw = localStorage.getItem("orders_state");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
})();

const initialState: OrdersState = {
  orders: Array.isArray(savedOrdersState.orders) ? savedOrdersState.orders : [],
  currentOrder: (savedOrdersState as any).currentOrder || null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action: { payload: Omit<Order, 'id' | 'orderDate' | 'status'> }) => {
      const newOrder: Order = {
        ...action.payload,
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        orderDate: new Date().toISOString(),
        status: 'pending',
      };
      state.orders.push(newOrder);
      state.currentOrder = newOrder;
    },
    setCurrentOrder: (state, action: { payload: string }) => {
      const order = state.orders.find(order => order.id === action.payload);
      state.currentOrder = order || null;
    },
    updateOrderStatus: (state, action: { payload: { orderId: string; status: Order['status'] } }) => {
      const order = state.orders.find(order => order.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
      if (state.currentOrder?.id === action.payload.orderId) {
        state.currentOrder.status = action.payload.status;
      }
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
});

export const { addOrder, setCurrentOrder, updateOrderStatus, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
