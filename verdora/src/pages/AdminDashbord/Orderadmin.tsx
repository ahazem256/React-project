import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { updateOrderStatus } from "../../redux/slices/ordersSlice";
import { Search, RefreshCw, MoreVertical, Check, X, Truck, Package, Clock } from "lucide-react";

interface Order {
  id: string;
  orderDate: string;
  items: any[];
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
  paymentMethod: string;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

const Orderadmin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusChangeMessage, setStatusChangeMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5005/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setStatusChangeMessage(null);
  }

  const handleStatusChange = async (orderId: string | number, newStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'cancelled') => {
    try {
      const response = await fetch(`http://localhost:5005/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(prev => prev.map(order =>
          String(order.id) === String(orderId) ? { ...order, status: newStatus } : order
        ));

        dispatch(updateOrderStatus({ orderId, status: newStatus }));
        
        
        setStatusChangeMessage(`Order status successfully changed to ${newStatus.toUpperCase()}!`);
        
        
        // setSelectedOrder(null); 
        // const modalEl = document.getElementById('statusModal');
        // if (modalEl) {
        //   (window as any).bootstrap.Modal.getInstance(modalEl)?.hide();
        // }
      } else {
        console.error("Failed to update order status");
        setStatusChangeMessage("Failed to update order status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setStatusChangeMessage("An error occurred while updating the order status.");
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.shippingInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.shippingInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.shippingInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'pending': return 'var(--color-green-sage)';
      case 'confirmed': return 'var(--color-green-medium)';
      case 'processing': return 'var(--color-green-dark)';
      case 'shipped': return 'var(--color-green-darker)';
      case 'cancelled': return '#e63946';
      default: return 'var(--color-green-sage)';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'confirmed': return <Check size={16} />;
      case 'processing': return <Package size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'cancelled': return <X size={16} />;
      default: return <Package size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border" style={{ color: 'var(--color-green-darkest)' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-green-lightest)', minHeight: '100vh', padding: '2rem' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', padding: '1.5rem 2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div className="d-flex justify-content-between align-items-center">
          <h1 style={{ color: 'var(--color-green-darkest)', margin: 0, fontSize: '1.75rem', fontWeight: '700' }}>Orders Management</h1>
          <button className="btn d-flex align-items-center gap-2" onClick={fetchOrders} style={{ backgroundColor: 'var(--color-green-darkest)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: '600' }}>
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ backgroundColor: 'white', padding: '1rem 1.5rem', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div className="row">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text" style={{ backgroundColor: 'var(--color-green-lightest)', border: '1px solid var(--color-green-sage)', color: 'var(--color-green-darkest)' }}>
                <Search size={18} />
              </span>
              <input type="text" className="form-control" placeholder="Search orders by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: '1px solid var(--color-green-sage)', borderLeft: 'none' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div className="table-responsive">
          <table className="table mb-0">
            <thead style={{ backgroundColor: 'var(--color-green-lightest)' }}>
              <tr>
                <th>#</th>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={7} className="text-center p-4 text-muted">No orders found</td></tr>
              ) : (
                filteredOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.shippingInfo.email}</td>
                    <td>{order.shippingInfo.firstName} {order.shippingInfo.lastName}</td>
                    <td>
                      <span style={{ backgroundColor: getStatusColor(order.status), color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                        {getStatusIcon(order.status)} {(order.status || 'pending').toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(order.orderDate).toLocaleString()}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <button className="btn btn-sm btn-light border" data-bs-toggle="modal" data-bs-target="#statusModal" onClick={() => handleSelectOrder(order)}>
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bootstrap Modal */}
      <div className="modal fade" id="statusModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header" style={{ backgroundColor: 'var(--color-green-lightest)', borderBottom: '1px solid var(--color-green-sage)' }}>
              <h5 className="modal-title" style={{ color: 'var(--color-green-darkest)', fontWeight: '700' }}>Change Order Status</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/* ✨ Conditional rendering for success message or status buttons */}
              {statusChangeMessage ? (
                <div className="alert alert-success" role="alert" style={{ color: 'var(--color-green-darkest)', backgroundColor: 'var(--color-green-lightest)', border: '1px solid var(--color-green-sage)', fontWeight: '600' }}>
                  {statusChangeMessage}
                </div>
              ) : (
                selectedOrder && (
                  <>
                    <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                    <div className="d-flex flex-wrap gap-2">
                      {['pending', 'confirmed', 'processing', 'shipped', 'cancelled'].map(status => (
                        <button
                          key={status}
                          style={{
                            backgroundColor: selectedOrder.status === status ? 'var(--color-green-darkest)' : 'transparent',
                            color: selectedOrder.status === status ? 'white' : 'var(--color-green-darkest)',
                            border: `2px solid var(--color-green-darkest)`,
                            borderRadius: '6px',
                            padding: '0.5rem 1rem',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-green-darker)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = selectedOrder.status === status ? 'var(--color-green-darkest)' : 'transparent')}
                          onClick={() => handleStatusChange(selectedOrder.id, status as any)}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </>
                )
              )}
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn" 
                data-bs-dismiss="modal" 
                style={{ backgroundColor: 'var(--color-green-darkest)', color: 'white' }}
                // ✨ Clear the selected order and message when closing
                onClick={() => { setSelectedOrder(null); setStatusChangeMessage(null); }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orderadmin;