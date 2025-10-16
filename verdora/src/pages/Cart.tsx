import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../redux/store";
import { removeFromCart, clearCart } from "../redux/slices/cartSlice";
import { Link } from "react-router-dom";
import "../styles/global.css";
const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalPrice = cartItems.reduce((sum, item) => {
    const price =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/[^\d.]/g, ""))
        : item.price;
    return sum + price * item.quantity;
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
    <div
      style={{
        maxWidth: "1000px",
        margin: "50px auto",
        padding: "40px 30px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        transition: "box-shadow 0.3s ease-in-out",
      }}
    >
      <h1 style={{ marginBottom: "32px", color: "var(--color-green-darkest)" }}>Your Cart</h1>

      <div>
        {cartItems.map((item) => {
          const productName = item.name || "Product";
          const productImage =
            typeof item.image === "string"
              ? item.image
              : item.image[0] || "";
          const price =
            typeof item.price === "string"
              ? parseFloat(item.price.replace(/[^\d.]/g, ""))
              : item.price;
          const currency =
            typeof item.price === "string" && item.price.includes("EGP")
              ? "EGP"
              : "$";

          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "24px",
                borderBottom: "1px solid #eee",
                paddingBottom: "16px",
              }}
            >
              <img
                src={productImage}
                alt={productName}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 8px 0" }}>{productName}</h3>
                <p style={{ margin: "0 0 8px 0", color: "#555" }}>
                  {item.quantity} × {currency}
                  {price.toFixed(2)}
                </p>
                <p style={{ fontWeight: "700", margin: 0 }}>
                  Subtotal: {currency}
                  {(price * item.quantity).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                style={{
                  backgroundColor: "#ff4d4d",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = "#e63946";
                  (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = "#ff4d4d";
                  (e.target as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      {/* Total Section */}
      <div style={{ marginTop: "32px", textAlign: "left" }}>
        <h2 style={{color :"var(--color-green-darkest)"}}>
          Total: {totalPrice.toFixed(2)}{" "}
          {cartItems.length > 0 &&
            typeof cartItems[0].price === "string" &&
            cartItems[0].price.includes("EGP")
            ? "EGP"
            : "$"}
        </h2>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            marginTop: "16px",
          }}
        >
          {/* Clear Button */}
          <button
            onClick={() => dispatch(clearCart())}
            style={{
              padding: "12px 20px",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "#5a6268";
              (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "#6c757d";
              (e.target as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            Clear Cart
          </button>

          {/* Checkout Button */}
          <button
            onClick={() => navigate("/checkout")}
            style={{
              padding: "12px 20px",
              backgroundColor: "var(--color-green-darkest)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "var(--color-green-dark)";
              (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "var(--color-green-darkest)";
              (e.target as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
