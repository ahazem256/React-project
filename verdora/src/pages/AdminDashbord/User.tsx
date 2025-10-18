import React, { useEffect, useState } from "react";

interface UserType {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

type ModalMode = "add" | "edit" | "delete";
interface UserModalProps {
  show: boolean;
  mode: ModalMode;
  user: UserType | null;
  newUserData: { name: string; email: string; role: "user" | "admin" };
  editUserData: { name: string; email: string; role: "user" | "admin" };
  onClose: () => void;
  onChangeNew: (next: { name: string; email: string; role: "user" | "admin" }) => void;
  onChangeEdit: (next: { name: string; email: string; role: "user" | "admin" }) => void;
  onConfirmAdd: () => Promise<void>;
  onConfirmEdit: () => Promise<void>;
  onConfirmDelete: () => Promise<void>;
}
const UserModal: React.FC<UserModalProps> = ({
  show,
  mode,
  user,
  newUserData,
  editUserData,
  onClose,
  onChangeNew,
  onChangeEdit,
  onConfirmAdd,
  onConfirmEdit,
  onConfirmDelete,
}) => {
  if (!show) return null;

  const title = mode === "add" ? "Add New Customer" : mode === "edit" ? "Edit Customer" : "Confirm Delete";
  const confirmBtnText = mode === "add" ? "Add Customer" : mode === "edit" ? "Update Customer" : "Delete";

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          {/* Body: form for add/edit, confirmation for delete */}
          <div className="modal-body">
            {mode === "delete" ? (
              <div className="text-center py-4">
                <div className="text-warning mb-3">
                  <i className="bi bi-exclamation-triangle" style={{ fontSize: "3rem" }}></i>
                </div>
                <h6>Delete {user?.name}?</h6>
                <p className="text-muted">This action cannot be undone.</p>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter customer name"
                    value={mode === "add" ? newUserData.name : editUserData.name}
                    onChange={(e) =>
                      mode === "add"
                        ? onChangeNew({ ...newUserData, name: e.target.value })
                        : onChangeEdit({ ...editUserData, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="customer@email.com"
                    value={mode === "add" ? newUserData.email : editUserData.email}
                    onChange={(e) =>
                      mode === "add"
                        ? onChangeNew({ ...newUserData, email: e.target.value })
                        : onChangeEdit({ ...editUserData, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Role</label>
                  <select
                    className="form-select text-success"
                    value={mode === "add" ? newUserData.role : editUserData.role}
                    onChange={(e) =>
                      mode === "add"
                        ? onChangeNew({ ...newUserData, role: e.target.value as "user" | "admin" })
                        : onChangeEdit({ ...editUserData, role: e.target.value as "user" | "admin" })
                    }
                  >
                    <option value="user" style={{backgroundColor:""}}>Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}
          </div>
          {/* Footer */}
          <div className="modal-footer border-0">
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            {mode === "add" && (
              <button className="btn btn-success" onClick={onConfirmAdd}>
                {confirmBtnText}
              </button>
            )}
            {mode === "edit" && (
              <button className="btn btn-success" onClick={onConfirmEdit}>
                {confirmBtnText}
              </button>
            )}
            {mode === "delete" && (
              <button className="btn btn-danger" onClick={onConfirmDelete}>
                {confirmBtnText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState<string>("");

  // single modal state for all modes
  const [modalState, setModalState] = useState<{
    show: boolean;
    mode: ModalMode;
    user: UserType | null;
  }>({ show: false, mode: "add", user: null });

  // form states for add / edit
  const [newUser, setNewUser] = useState<{ name: string; email: string; role: "user" | "admin" }>({
    name: "",
    email: "",
    role: "user",
  });
  const [editUser, setEditUser] = useState<{ name: string; email: string; role: "user" | "admin" }>({
    name: "",
    email: "",
    role: "user",
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage] = useState<number>(5);

  useEffect(() => {
    const controller = new AbortController();
    const fetchUsers = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/users", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: UserType[] = await response.json();
        setUsers(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
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

  // open modal helpers
  const openAddModal = () => {
    setNewUser({ name: "", email: "", role: "user" });
    setModalState({ show: true, mode: "add", user: null });
  };

  const openEditModal = (user: UserType) => {
    setEditUser({ name: user.name, email: user.email, role: user.role });
    setModalState({ show: true, mode: "edit", user });
  };

  const openDeleteModal = (user: UserType) => {
    setModalState({ show: true, mode: "delete", user });
  };

  const closeModal = () => {
    setModalState({ show: false, mode: "add", user: null });
    // reset temp states
    setNewUser({ name: "", email: "", role: "user" });
    setEditUser({ name: "", email: "", role: "user" });
  };

  // Add
  const handleAddUser = async (): Promise<void> => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const addedUser: UserType = await response.json();
        setUsers((prev) => [...prev, addedUser]);
        closeModal();
        const totalPages = Math.ceil((users.length + 1) / usersPerPage);
        setCurrentPage(totalPages);
      } else {
        alert("Failed to add customer");
      }
    } catch (err) {
      alert("An error occurred while adding");
      console.error("Add error:", err);
    }
  };

  // Edit
  const handleEditConfirm = async (): Promise<void> => {
    if (!modalState.user) return;

    if (!editUser.name.trim() || !editUser.email.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${modalState.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editUser),
      });

      if (response.ok) {
        const updatedUser: UserType = await response.json();
        setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        closeModal();
      } else {
        alert("Failed to update customer");
      }
    } catch (err) {
      alert("An error occurred while updating");
      console.error("Update error:", err);
    }
  };

  // Delete
  const handleDeleteConfirm = async (): Promise<void> => {
    if (!modalState.user) return;

    try {
      const response = await fetch(`http://localhost:5000/users/${modalState.user.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== modalState.user!.id));
        // handle page decrement when last item removed on page
        const filteredAfterDelete = filteredUsersAfterState(users, modalState.user!.id);
        if (filteredAfterDelete.length === 1 && currentPage > 1) {
          setCurrentPage((p) => p - 1);
        }
        closeModal();
      } else {
        alert("Failed to delete customer");
      }
    } catch (err) {
      alert("An error occurred while deleting");
      console.error("Delete error:", err);
    }
  };

  // Helper to compute filtered users after a deletion (used to determine page change)
  const filteredUsersAfterState = (existingUsers: UserType[], deletingId: number) =>
    existingUsers.filter((u) => u.id !== deletingId).filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser: number = currentPage * usersPerPage;
  const indexOfFirstUser: number = indexOfLastUser - usersPerPage;
  const currentUsers: UserType[] = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages: number = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

  const nextPage = (): void => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const prevPage = (): void => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Get admin user
  const adminUser = users.find((user) => user.role === "admin");

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-white">
        <div className="text-center">
          <div className="spinner-border text-success" style={{ width: "3rem", height: "3rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-white">
        <div className="card border-0 shadow-sm" style={{ maxWidth: "400px" }}>
          <div className="card-body text-center p-4">
            <div className="text-danger mb-3">
              <i className="bi bi-exclamation-triangle" style={{ fontSize: "3rem" }}></i>
            </div>
            <h5 className="mb-3">Something went wrong</h5>
            <p className="text-muted mb-3">{error}</p>
            <button className="btn btn-outline-success" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-vh-100">
      <div className="container-fluid px-4 py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 fw-bold text-dark mb-1">Customer Management</h1>
                <p className="text-muted mb-0">Manage your plant shop customers and administrators</p>
              </div>
              <button className="btn" style={{backgroundColor:"#718355", color:"#ffffff"}} onClick={openAddModal}>
                <i className="bi bi-plus-circle me-2"></i>
                Add Customer
              </button>
            </div>
          </div>
        </div>
        {/* Admin Card - Featured */}
        {adminUser && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{backgroundColor:"#718355", color:"#ffffff"}}>
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <div className="d-flex align-items-center">
                        <div>
                          <h5 className="mb-1 fw-bold">{adminUser.name}</h5>
                          <p className="mb-1 opacity-75">{adminUser.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                      <div className="text-white-50">
                        <i className="bi bi-info-circle me-1"></i>
                        Full system access and permissions
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 rounded p-3 me-3">
                    <i className="bi bi-people-fill text-success"></i>
                  </div>
                  <div>
                    <h4 className="mb-0 fw-bold">{users.length}</h4>
                    <small className="text-muted">Total Users</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 rounded p-3 me-3">
                    <i className="bi bi-person-check text-success"></i>
                  </div>
                  <div>
                    <h4 className="mb-0 fw-bold">{users.filter((u) => u.role === "user").length}</h4>
                    <small className="text-muted">Customers</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-warning bg-opacity-10 rounded p-3 me-3">
                    <i className="bi bi-star-fill text-warning"></i>
                  </div>
                  <div>
                    <h4 className="mb-0 fw-bold">{users.filter((u) => u.role === "admin").length}</h4>
                    <small className="text-muted">Administrators</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-info bg-opacity-10 rounded p-3 me-3">
                    <i className="bi bi-search text-info"></i>
                  </div>
                  <div>
                    <h4 className="mb-0 fw-bold">{filteredUsers.length}</h4>
                    <small className="text-muted">Search Results</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Search and Table Section */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                {/* Search Bar */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <i className="bi bi-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 bg-light"
                        placeholder="Search customers by name or email..."
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button className="btn btn-light border-0" onClick={() => setSearchTerm("")}>
                          <i className="bi bi-x text-muted"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Table */}
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="text-muted mb-3">
                      <i className="bi bi-people" style={{ fontSize: "3rem" }}></i>
                    </div>
                    <h5 className="text-dark">No customers found</h5>
                    <p className="text-muted">Try adjusting your search or add a new customer</p>
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="bg-light">
                          <tr>
                            <th className="border-0 fw-semibold text-dark py-3">ID</th>
                            <th className="border-0 fw-semibold text-dark py-3">Customer</th>
                            <th className="border-0 fw-semibold text-dark py-3">Email</th>
                            <th className="border-0 fw-semibold text-dark py-3">Role</th>
                            <th className="border-0 fw-semibold text-dark py-3 text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentUsers
                            .filter((user) => user.role === "user")
                            .map((user: UserType) => (
                              <tr key={user.id} className="border-top">
                                <td className="py-3">
                                  <span className="text-muted">#{user.id}</span>
                                </td>
                                <td className="py-3">
                                  <div className="d-flex align-items-center">
                                    <div
                                      className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                                      style={{ width: "40px", height: "40px" }}
                                    >
                                      <i className="bi bi-person text-success"></i>
                                    </div>
                                    <div>
                                      <div className="fw-semibold text-dark">{user.name}</div>
                                      <small className="text-muted">Customer</small>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3">
                                  <span className="text-muted">{user.email}</span>
                                </td>
                                <td className="py-3 text-end">
                                  <div className="btn-group">
                                    <button className="btn btn-sm btn-outline-success" onClick={() => openEditModal(user)}>
                                      <i className="bi bi-pencil me-1"></i>
                                      Edit
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => openDeleteModal(user)}>
                                      <i className="bi bi-trash me-1"></i>
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <div className="text-muted small">
                          Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} customers
                        </div>
                        <nav>
                          <ul className="pagination mb-0">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                              <button className="page-link" onClick={prevPage} disabled={currentPage === 1}>
                                <i className="bi bi-chevron-left"></i>
                              </button>
                            </li>
                            {pageNumbers.map((number: number) => (
                              <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                                <button className="page-link" onClick={() => paginate(number)}>
                                  {number}
                                </button>
                              </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                              <button className="page-link" onClick={nextPage} disabled={currentPage === totalPages}>
                                <i className="bi bi-chevron-right"></i>
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Unified Modal */}
        <UserModal
          show={modalState.show}
          mode={modalState.mode}
          user={modalState.user}
          newUserData={newUser}
          editUserData={editUser}
          onClose={closeModal}
          onChangeNew={setNewUser}
          onChangeEdit={setEditUser}
          onConfirmAdd={handleAddUser}
          onConfirmEdit={handleEditConfirm}
          onConfirmDelete={handleDeleteConfirm}
        />

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet" />
      </div>
    </div>
  );
};

export default UsersTable;
