import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const allOrders = useSelector((state: RootState) => state.orders.orders);

  // Sort by most recent
  const sortedOrders = [...allOrders].sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );

  if (allOrders.length === 0) {
    return (
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <h2>No orders found</h2>
          <p>You haven’t placed any orders yet.</p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Go Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ marginBottom: "32px", textAlign: "center" }}>Order History</h1>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "32px" }}>
        You have {allOrders.length} order{allOrders.length !== 1 ? "s" : ""} in total
      </p>

      {sortedOrders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>Order #{order.id}</h3>
              <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
                📅 {new Date(order.orderDate).toLocaleDateString()} at{" "}
                {new Date(order.orderDate).toLocaleTimeString()}
              </p>
              <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
                💰 Total: ${order.total.toFixed(2)}
              </p>
            </div>
            <span
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                backgroundColor:
                  order.status === "pending"
                    ? "#ffc107"
                    : order.status === "confirmed"
                    ? "#007bff"
                    : order.status === "shipped"
                    ? "#28a745"
                    : "#6c757d",
                color: order.status === "pending" ? "#000" : "#fff",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {order.status.toUpperCase()}
            </span>
          </div>

          {/* Details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            {/* Shipping */}
            <div>
              <h4>📦 Shipping</h4>
              <p><strong>{order.shippingInfo.firstName} {order.shippingInfo.lastName}</strong></p>
              <p>{order.shippingInfo.address}</p>
              <p>{order.shippingInfo.city}, {order.shippingInfo.zipCode}</p>
            </div>

            {/* Payment */}
            <div>
              <h4>💳 Payment</h4>
              <p>{order.paymentMethod === "credit-card" ? "Credit Card" : "Cash on Delivery"}</p>
              <p>{order.shippingInfo.email}</p>
            </div>

            {/* Items */}
            <div>
              <h4>🛍️ Items ({order.items.length})</h4>
              <div style={{ maxHeight: "120px", overflowY: "auto" }}>
                {order.items.map((item) => {
                  const productName = item.name || "Product";
                  const productImage = typeof item.image === "string" ? item.image : item.image[0] || "";
                  const price =
                    typeof item.price === "string"
                      ? parseFloat(item.price.replace(/[^\d.]/g, ""))
                      : item.price;
                  const currency =
                    typeof item.price === "string" && item.price.includes("EGP") ? "EGP" : "$";

                  return (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                      <img
                        src={productImage}
                        alt={productName}
                        style={{ width: "30px", height: "30px", objectFit: "cover", borderRadius: "4px", marginRight: "8px" }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: "12px", fontWeight: 500 }}>
                          {productName}
                        </p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#666" }}>
                          Qty: {item.quantity} × {currency}{price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ textAlign: "right", borderTop: "1px solid #eee", paddingTop: "12px", marginTop: "16px" }}>
            <button
              onClick={() => alert(`Order #${order.id}\nTotal: $${order.total.toFixed(2)}`)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                marginRight: "8px",
              }}
            >
              View Details
            </button>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Shop Again
            </button>
          </div>
        </div>
      ))}

      {/* Summary */}
      <div style={{ textAlign: "center", marginTop: "32px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
        <h3>Order Summary</h3>
        <p>Total Orders: <strong>{allOrders.length}</strong></p>
        <p>Total Spent: <strong>${allOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}</strong></p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrdersPage;
