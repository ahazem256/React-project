import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/order.css";

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUserEmail = (localStorage.getItem("userEmail") || "").toLowerCase().trim();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user orders
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5005/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        const filtered = Array.isArray(data)
          ? data.filter((o: any) => (o?.shippingInfo?.email || "").toLowerCase().trim() === currentUserEmail)
          : [];
        setOrders(filtered);
      } catch (e) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, [currentUserEmail]);

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const orderRes = await fetch(`http://localhost:5005/orders/${orderId}`);
      if (!orderRes.ok) return console.error("Order not found on server");

      const orderData = await orderRes.json();

      const deleteRes = await fetch(`http://localhost:5005/orders/${orderData.id}`, {
        method: "DELETE",
      });

      if (!deleteRes.ok) return console.error("Failed to delete order on server");

      // Update local state
      setOrders(prev => prev.filter(o => o.id !== orderId));

      // Update product stocks
      for (const item of orderData.items) {
        const res = await fetch(`http://localhost:5005/products/${item.id}`);
        if (!res.ok) continue;

        const product = await res.json();
        const updatedStock = (product.stock ?? 0) + item.quantity;

        await fetch(`http://localhost:5005/products/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: updatedStock }),
        });
      }

      console.log("Order deleted and stock updated successfully!");
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
  };

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.orderDate || b.createdAt || 0).getTime() - new Date(a.orderDate || a.createdAt || 0).getTime()
  );

  if (loading) {
    return (
      <div className="orders-empty">
        <h2>Loading your orders...</h2>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <h2>No orders yet</h2>
        <p>You haven't placed any orders.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>Order History</h1>
      <p>You have {orders.length} order{orders.length !== 1 ? "s" : ""}</p>

      {sortedOrders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div>
              <h3>Order #{order.id}</h3>
              <p>{new Date(order.orderDate || order.createdAt).toLocaleString()}</p>
              <p>Total: ${Number(order.total ?? 0).toFixed(2)}</p>
            </div>
            <span className={`status ${order.status || 'pending'}`}>
              {(order.status || 'pending').toUpperCase()}
            </span>
          </div>

          <div className="order-details">
            <div>
              <h4>Shipping</h4>
              <p>{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
              <p>{order.shippingInfo.address}</p>
              <p>{order.shippingInfo.city}, {order.shippingInfo.zipCode}</p>
            </div>
            <div>
              <h4>Payment</h4>
              <p>{order.paymentMethod === "credit-card" ? "Credit Card" : "Cash on Delivery"}</p>
              <p>{order.shippingInfo.email}</p>
            </div>
            <div>
              <h4>Items ({order.items.length})</h4>
              <ul>
                {order.items.map((item: any) => (
                  <li key={String(item.id)}>
                    {item.image && <img src={item.image} alt={item.name} className="order-item-image" />}
                    <div className="order-item-details">
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-quantity">Quantity: {item.quantity}</span>
                    </div>
                    <span className="order-item-price">${item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="order-actions">
            <button className="btn bg-dark text-light" onClick={() => alert(`Order #${order.id}\nTotal: ${order.total.toFixed(2)}`)}>
              View Details
            </button>
            <button className="btn bg-dark text-light" onClick={() => navigate("/")}>
              Shop Again
            </button>
            <button className="btn bg-dark text-light" onClick={() => handleDeleteOrder(order.id)}>
              Delete Order
            </button>
          </div>
        </div>
      ))}

      <div className="order-summary">
        <h3>Order Summary</h3>
        <p>
          <span>Total Orders:</span>
          <span>{orders.length}</span>
        </p>
        <p>
          <span>Total Spent:</span>
          <span>${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}</span>
        </p>
        <button className="btn btn-success" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrdersPage;
