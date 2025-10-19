import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import { removeOrder } from "../redux/slices/ordersSlice";
import "../styles/order.css"

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allOrders = useSelector((state: RootState) => state.orders.orders);

  const currentUserEmail = localStorage.getItem("userEmail");
  const userOrders = allOrders.filter(
    order => order.shippingInfo.email.toLowerCase().trim() === currentUserEmail
  );

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const orderRes = await fetch(`http://localhost:5005/orders/${orderId}`);
      if (!orderRes.ok) return console.error("Order not found on server");

      const orderData = await orderRes.json();

      const deleteRes = await fetch(`http://localhost:5005/orders/${orderData.id}`, {
        method: "DELETE",
      });
      if (!deleteRes.ok) return console.error("Failed to delete order on server");

      dispatch(removeOrder(orderId));

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

  const sortedOrders = [...userOrders].sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );

  if (userOrders.length === 0) {
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
      <p>You have {userOrders.length} order{userOrders.length !== 1 ? "s" : ""}</p>

      {sortedOrders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div>
              <h3>Order #{order.id}</h3>
              <p>{new Date(order.orderDate).toLocaleString()}</p>
              <p>Total: ${order.total.toFixed(2)}</p>
            </div>
            <span className={`status ${order.status ?? 'pending'}`}>
              {(order.status ?? 'pending').toUpperCase()}
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
                {order.items.map((item) => (
                  <li key={item.id}>
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
          <span>{userOrders.length}</span>
        </p>
        <p>
          <span>Total Spent:</span>
          <span>${userOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}</span>
        </p>
        <button className="btn btn-success" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrdersPage;
