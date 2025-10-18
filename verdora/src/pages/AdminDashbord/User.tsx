import React, { useEffect, useState } from "react";

interface UserType {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; user: UserType | null }>({
    show: false,
    user: null
  });
  const [addModal, setAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" as "user" | "admin" });

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await fetch("http://localhost:5000/users", {
          signal: controller.signal,
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return;
        }
        setError("Failed to load customers");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      controller.abort();
    };
  }, []);

  const handleDeleteClick = (user: UserType) => {
    setDeleteModal({ show: true, user });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.user) return;

    try {
      const response = await fetch(`http://localhost:5000/users/${deleteModal.user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(u => u.id !== deleteModal.user!.id));
        setDeleteModal({ show: false, user: null });
      } else {
        alert("Failed to delete customer");
      }
    } catch (err) {
      alert("An error occurred while deleting");
      console.error("Delete error:", err);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/users", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const addedUser = await response.json();
        setUsers([...users, addedUser]);
        setAddModal(false);
        setNewUser({ name: "", email: "", role: "user" });
      } else {
        alert("Failed to add customer");
      }
    } catch (err) {
      alert("An error occurred while adding");
      console.error("Add error:", err);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ 
        background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
      }}>
        <div className="text-center">
          <div className="spinner-border" style={{ 
            width: '3.5rem', 
            height: '3.5rem',
            color: '#2e7d32'
          }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 fs-5 fw-semibold" style={{ color: '#2e7d32' }}>
            🌱 Loading Garden...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ 
        background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
      }}>
        <div className="card border-0 shadow-lg" style={{ maxWidth: '500px', borderRadius: '20px' }}>
          <div className="card-body text-center p-5">
            <div style={{ fontSize: '4rem' }}>🍂</div>
            <h3 className="fw-bold mb-3" style={{ color: '#2e7d32' }}>Oops! Something went wrong</h3>
            <p className="text-muted mb-4">{error}</p>
            <button 
              className="btn btn-success btn-lg px-5 shadow-sm"
              onClick={() => window.location.reload()}
              style={{ borderRadius: '50px' }}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ 
      background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
      paddingTop: '2rem',
      paddingBottom: '3rem'
    }}>
      <div className="container-fluid px-4">
        {/* Welcome Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ 
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f1f8f4 100%)'
            }}>
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="d-flex align-items-center">
                      <div className="me-3" style={{ fontSize: '3rem' }}>🪴</div>
                      <div>
                        <h2 className="mb-1 fw-bold" style={{ color: '#2e7d32' }}>
                          Customer Dashboard
                        </h2>
                        <p className="mb-0 text-muted">
                          <i className="bi bi-tree-fill me-2" style={{ color: '#66bb6a' }}></i>
                          Manage your plant shop customers
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 text-lg-end mt-3 mt-lg-0">
                    <button 
                      className="btn btn-success btn-lg px-4 shadow-sm me-2"
                      onClick={() => setAddModal(true)}
                      style={{ borderRadius: '50px' }}
                    >
                      <i className="bi bi-person-plus-fill me-2"></i>
                      Add Customer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={{ 
              borderRadius: '15px',
              background: 'linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%)'
            }}>
              <div className="card-body text-center p-4">
                <div style={{ fontSize: '2.5rem' }} className="mb-2">👥</div>
                <h3 className="display-6 fw-bold mb-1" style={{ color: '#2e7d32' }}>{users.length}</h3>
                <p className="mb-0 text-muted small">Total Customers</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={{ 
              borderRadius: '15px',
              background: 'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)'
            }}>
              <div className="card-body text-center p-4">
                <div style={{ fontSize: '2.5rem' }} className="mb-2">👑</div>
                <h3 className="display-6 fw-bold mb-1" style={{ color: '#f57f17' }}>
                  {users.filter(u => u.role === "admin").length}
                </h3>
                <p className="mb-0 small" style={{ color: '#f57f17' }}>Admins</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={{ 
              borderRadius: '15px',
              background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)'
            }}>
              <div className="card-body text-center p-4">
                <div style={{ fontSize: '2.5rem' }} className="mb-2">🌱</div>
                <h3 className="display-6 fw-bold mb-1" style={{ color: '#1b5e20' }}>
                  {users.filter(u => u.role === "user").length}
                </h3>
                <p className="mb-0 small" style={{ color: '#1b5e20' }}>Regular Customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <div className="card-body p-3">
                <div className="position-relative">
                  <i className="bi bi-search position-absolute" style={{ 
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#66bb6a',
                    fontSize: '1.2rem'
                  }}></i>
                  <input
                    type="text"
                    className="form-control form-control-lg border-0 ps-5"
                    placeholder="🔍 Search customers by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                      paddingLeft: '50px',
                      background: 'white',
                      fontSize: '1rem'
                    }}
                  />
                  {searchTerm && (
                    <button 
                      className="btn position-absolute"
                      onClick={() => setSearchTerm("")}
                      style={{ 
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#66bb6a'
                      }}
                    >
                      <i className="bi bi-x-circle-fill fs-5"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Table */}
        <div className="row">
          <div className="col-12">
            {filteredUsers.length === 0 ? (
              <div className="card border-0 shadow-sm" style={{ borderRadius: '20px' }}>
                <div className="card-body text-center py-5">
                  <div style={{ fontSize: '5rem' }} className="mb-3">🌿</div>
                  <h4 className="fw-bold mb-2" style={{ color: '#2e7d32' }}>No Customers Found</h4>
                  <p className="text-muted">Try adjusting your search or add a new customer</p>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead style={{ background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)' }}>
                      <tr>
                        <th className="py-3 px-4 text-white fw-semibold border-0">ID</th>
                        <th className="py-3 px-4 text-white fw-semibold border-0">Customer</th>
                        <th className="py-3 px-4 text-white fw-semibold border-0">Email</th>
                        <th className="py-3 px-4 text-white fw-semibold border-0">Role</th>
                        <th className="py-3 px-4 text-white fw-semibold border-0 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody style={{ background: 'white' }}>
                      {filteredUsers.map((user, index) => (
                        <tr key={user.id} style={{ 
                          borderBottom: '1px solid #f0f0f0'
                        }}>
                          <td className="py-3 px-4">
                            <span className="badge bg-success-subtle text-success px-3 py-2 fw-bold">
                              #{user.id}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="d-flex align-items-center gap-3">
                              <div 
                                className="d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                                style={{ 
                                  width: '48px', 
                                  height: '48px',
                                  background: user.role === "admin" 
                                    ? 'linear-gradient(135deg, #fbc02d 0%, #f9a825 100%)' 
                                    : 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)',
                                  borderRadius: '12px',
                                  fontSize: '1.3rem'
                                }}
                              >
                                {user.role === "admin" ? "👑" : "🌱"}
                              </div>
                              <div>
                                <div className="fw-bold" style={{ color: '#2e7d32' }}>{user.name}</div>
                                <small className="text-muted">
                                  <i className="bi bi-calendar-check me-1"></i>
                                  Member since 2024
                                </small>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <i className="bi bi-envelope-fill me-2" style={{ color: '#81c784' }}></i>
                            <span className="text-muted">{user.email}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span 
                              className="badge px-3 py-2 fw-semibold"
                              style={{
                                background: user.role === "admin" 
                                  ? 'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)'
                                  : 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)',
                                color: user.role === "admin" ? '#f57f17' : '#1b5e20',
                                border: user.role === "admin" ? '2px solid #fbc02d' : '2px solid #66bb6a',
                                borderRadius: '10px'
                              }}
                            >
                              {user.role === "admin" ? (
                                <>
                                  <i className="bi bi-star-fill me-1"></i>
                                  Admin
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-person-fill me-1"></i>
                                  Customer
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="btn-group shadow-sm" role="group">
                              <button 
                                className="btn btn-sm btn-success"
                                title="Edit"
                                style={{ borderRadius: '8px 0 0 8px' }}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteClick(user)}
                                title="Delete"
                                style={{ borderRadius: '0 8px 8px 0' }}
                              >
                                <i className="bi bi-trash-fill"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Modal */}
        {deleteModal.show && (
          <>
            <div className="modal show d-block" tabIndex={-1}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                  <div className="modal-header border-0">
                    <h5 className="modal-title fw-bold" style={{ color: '#2e7d32' }}>
                      <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                      Confirm Delete
                    </h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setDeleteModal({ show: false, user: null })}
                    ></button>
                  </div>
                  <div className="modal-body text-center py-4">
                    <div style={{ fontSize: '4rem' }} className="mb-3">🍂</div>
                    <h5 className="mb-3" style={{ color: '#2e7d32' }}>
                      Are you sure you want to remove this customer?
                    </h5>
                    <div className="alert alert-light border">
                      <div className="fw-bold">{deleteModal.user?.name}</div>
                      <small className="text-muted">{deleteModal.user?.email}</small>
                    </div>
                    <p className="text-danger small mb-0">
                      <i className="bi bi-info-circle me-1"></i>
                      This action cannot be undone
                    </p>
                  </div>
                  <div className="modal-footer border-0">
                    <button 
                      className="btn btn-secondary px-4"
                      onClick={() => setDeleteModal({ show: false, user: null })}
                      style={{ borderRadius: '50px' }}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancel
                    </button>
                    <button 
                      className="btn btn-danger px-4"
                      onClick={handleDeleteConfirm}
                      style={{ borderRadius: '50px' }}
                    >
                      <i className="bi bi-trash-fill me-2"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop show"></div>
          </>
        )}

        {/* Add Customer Modal */}
        {addModal && (
          <>
            <div className="modal show d-block" tabIndex={-1}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                  <div className="modal-header border-0" style={{ 
                    background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)'
                  }}>
                    <h5 className="modal-title fw-bold" style={{ color: '#1b5e20' }}>
                      <i className="bi bi-person-plus-fill me-2"></i>
                      Add New Customer
                    </h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => {
                        setAddModal(false);
                        setNewUser({ name: "", email: "", role: "user" });
                      }}
                    ></button>
                  </div>
                  <div className="modal-body py-4">
                    <div className="text-center mb-4">
                      <div style={{ fontSize: '4rem' }}>🌱</div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ color: '#2e7d32' }}>
                        <i className="bi bi-person me-2"></i>
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter customer name..."
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        style={{ borderRadius: '12px', border: '2px solid #c8e6c9' }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ color: '#2e7d32' }}>
                        <i className="bi bi-envelope me-2"></i>
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="customer@email.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        style={{ borderRadius: '12px', border: '2px solid #c8e6c9' }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ color: '#2e7d32' }}>
                        <i className="bi bi-shield-check me-2"></i>
                        Account Type
                      </label>
                      <select
                        className="form-select form-select-lg"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "user" | "admin" })}
                        style={{ borderRadius: '12px', border: '2px solid #c8e6c9' }}
                      >
                        <option value="user">🌱 Customer</option>
                        <option value="admin">👑 Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button 
                      className="btn btn-secondary px-4"
                      onClick={() => {
                        setAddModal(false);
                        setNewUser({ name: "", email: "", role: "user" });
                      }}
                      style={{ borderRadius: '50px' }}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancel
                    </button>
                    <button 
                      className="btn btn-success px-4"
                      onClick={handleAddUser}
                      style={{ borderRadius: '50px' }}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Add Customer
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop show"></div>
          </>
        )}
      </div>

      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet" />
    </div>
  );
};

export default UsersTable;