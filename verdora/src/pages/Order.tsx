import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/order.css";

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUserEmail = (localStorage.getItem("userEmail") || "")
    .toLowerCase()
    .trim();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4; // ✅ Show 4 orders per page

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5005/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        const filtered = Array.isArray(data)
          ? data.filter(
              (o: any) =>
                (o?.shippingInfo?.email || "").toLowerCase().trim() ===
                currentUserEmail
            )
          : [];
        setOrders(filtered);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, [currentUserEmail]);

  const handleDeleteOrder = async (orderId: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete your order.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const orderRes = await fetch(`http://localhost:5005/orders/${orderId}`);
      if (!orderRes.ok)
        return Swal.fire("Error", "Order not found!", "error");

      const orderData = await orderRes.json();

      const deleteRes = await fetch(
        `http://localhost:5005/orders/${orderData.id}`,
        {
          method: "DELETE",
        }
      );

      if (!deleteRes.ok)
        return Swal.fire("Error", "Failed to delete order!", "error");

      setOrders((prev) => prev.filter((o) => o.id !== orderId));

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

      Swal.fire({
        title: "Deleted!",
        text: "Order deleted successfully.",
        icon: "success",
        confirmButtonColor: "#000",
      });
    } catch {
      Swal.fire("Error", "Something went wrong while deleting.", "error");
    }
  };

  const handleViewDetails = (order: any) => {
    Swal.fire({
      title: `Order #${order.id}`,
      html: `
        <div style="text-align:left">
          <p><b>Date:</b> ${new Date(
            order.orderDate || order.createdAt
          ).toLocaleString()}</p>
          <p><b>Total:</b> $${Number(order.total ?? 0).toFixed(2)}</p>
          <hr>
          <h4>Items:</h4>
          <ul style="list-style:none; padding:0;">
            ${order.items
              .map(
                (item: any) => `
              <li style="margin-bottom:8px; display:flex; align-items:center; gap:10px;">
                <img src="${item.image}" width="40" height="40" style="border-radius:6px;"/>
                <div>
                  <p style="margin:0;"><b>${item.name}</b></p>
                  <p style="margin:0; font-size:13px;">Qty: ${item.quantity} - $${item.price}</p>
                </div>
              </li>
            `
              )
              .join("")}
          </ul>
        </div>
      `,
      confirmButtonColor: "#000",
    });
  };

  const sortedOrders = [...orders].sort(
    (a, b) =>
      new Date(b.orderDate || b.createdAt || 0).getTime() -
      new Date(a.orderDate || a.createdAt || 0).getTime()
  );

  // Pagination logic
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);

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
    <div className="orders-container" style={{ backgroundColor: "#fff" }}>
      <h1>Order History</h1>
      <p>
        You have {orders.length} order{orders.length !== 1 ? "s" : ""}
      </p>

      {currentOrders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div>
              <h3>Order #{order.id}</h3>
              <p>{new Date(order.orderDate || order.createdAt).toLocaleString()}</p>
              <p>Total: ${Number(order.total ?? 0).toFixed(2)}</p>
            </div>
            <span className={`status ${order.status || "pending"}`}>
              {(order.status || "pending").toUpperCase()}
            </span>
          </div>

          <div className="order-details" style={{ backgroundColor: "#ffffff" }}>
            <div>
              <h4>Shipping</h4>
              <p>
                {order.shippingInfo.firstName} {order.shippingInfo.lastName}
              </p>
              <p>{order.shippingInfo.address}</p>
              <p>
                {order.shippingInfo.city}, {order.shippingInfo.zipCode}
              </p>
            </div>
            <div>
              <h4>Payment</h4>
              <p>
                {order.paymentMethod === "credit-card"
                  ? "Credit Card"
                  : "Cash on Delivery"}
              </p>
              <p>{order.shippingInfo.email}</p>
            </div>
          </div>

          <div className="order-actions justify-content-evenly">
            <button
              className="btn view-btn btn-dark"
              onClick={() => handleViewDetails(order)}
            >
              View Details
            </button>
            <button className="btn shop-btn btn-dark" onClick={() => navigate("/")}>
              Shop Again
            </button>
            <button
              className="btn delete-btn btn-dark"
              onClick={() => handleDeleteOrder(order.id)}
            >
              Delete Order
            </button>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="page-nav-btn"
            disabled={currentPage === 1}
            onClick={handlePrev}
          >
            ‹ Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="page-nav-btn"
            disabled={currentPage === totalPages}
            onClick={handleNext}
          >
            Next ›
          </button>
        </div>
      )}

      <style>{`
        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin: 35px 0;
        }

        .page-btn, .page-nav-btn {
          background-color: #f8f8f8;
          border: 1px solid #ddd;
          color: #333;
          padding: 8px 14px;
          border-radius: 25px;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .page-btn:hover, .page-nav-btn:hover {
          background-color: #000;
          color: #fff;
        }

        .page-btn.active {
          background-color: #000;
          color: #fff;
          border-color: #000;
        }

        .page-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default OrdersPage;
