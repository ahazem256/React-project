import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { removeFromCart, clearCart } from "../redux/slices/cartSlice";
import { Link } from "react-router-dom";

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // حساب السعر الإجمالي
  const totalPrice = cartItems.reduce((sum, item) => {
    const priceNumber = parseFloat(item.price.replace(/[^\d.]/g, ""));
    return sum + priceNumber * item.quantity;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>Your cart is empty</h2>
        <Link to="/" style={{ color: "#333", textDecoration: "underline" }}>
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ marginBottom: "32px" }}>Your Cart</h1>
      <div>
        {cartItems.map((item) => {
          const priceNumber = parseFloat(item.price.replace(/[^\d.]/g, ""));
          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "24px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "16px",
              }}
            >
              <img
                src={typeof item.image === "string" ? item.image : item.image[0]}
                alt={item.name}
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px" }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 8px 0" }}>{item.name}</h3>
                <p style={{ margin: "0 0 8px 0", color: "#555" }}>
                  {item.quantity} × {priceNumber} EGP
                </p>
                <p style={{ fontWeight: "700", margin: 0 }}>Subtotal: {priceNumber * item.quantity} EGP</p>
              </div>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                style={{
                  backgroundColor: "#f44336",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "32px", textAlign: "right" }}>
        <h2>Total: {totalPrice.toFixed(2)} EGP</h2>
        <button
          onClick={() => dispatch(clearCart())}
          style={{
            marginTop: "16px",
            padding: "12px 20px",
            backgroundColor: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;
