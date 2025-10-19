import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  ArrowLeftCircle,
  Menu,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../../styles/global.css";

/* ---------- Types ---------- */
interface UserType {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}
type ModalMode = "add" | "edit" | "delete";
type FormData = {
  name: string;
  email: string;
  role: "user" | "admin";
};

/* ---------- Validation Schema ---------- */
const userSchema = yup.object({
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  role: yup.mixed<"user" | "admin">().oneOf(["user", "admin"]).required(),
});

/* ---------- Modal Component ---------- */
interface UserModalProps {
  show: boolean;
  mode: ModalMode;
  user: UserType | null;
  defaultValues: FormData;
  onClose: () => void;
  onAdd: (data: FormData) => Promise<void>;
  onEdit: (data: FormData) => Promise<void>;
  onDelete: () => Promise<void>;
}
const UserModal: React.FC<UserModalProps> = ({
  show,
  mode,
  user,
  defaultValues,
  onClose,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: yupResolver(userSchema),
    defaultValues,
  });

  useEffect(() => {
    if (show) reset(defaultValues);
  }, [show, defaultValues, reset]);

  if (!show) return null;

  const title = mode === "add" ? "Add New Customer" : mode === "edit" ? "Edit Customer" : "Confirm Delete";
  const confirmBtnText = mode === "add" ? "Add Customer" : mode === "edit" ? "Update Customer" : "Delete";

  const onSubmit = async (data: FormData) => {
    try {
      if (mode === "add") await onAdd(data);
      if (mode === "edit") await onEdit(data);
    } catch (err: any) {
      setError("name", { type: "manual", message: err?.message || "Operation failed" });
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "#ffffffd4" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
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
                {errors.name?.message && (
                  <div className="alert alert-danger py-2">{errors.name.message}</div>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      placeholder="Enter customer name"
                      {...register("name")}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="customer@email.com"
                      {...register("email")}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Role</label>
                    <select className={`form-select ${errors.role ? "is-invalid" : ""}`} {...register("role")}>
                      <option value="user">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                    {errors.role && <div className="invalid-feedback">{errors.role.message as string}</div>}
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={isSubmitting}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                      {confirmBtnText}
                    </button>
                  </div>
                </form>
              </>
            )}
            {mode === "delete" && (
              <div className="modal-footer border-0">
                <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
                <button className="btn btn-danger" onClick={onDelete}>{confirmBtnText}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Main Component ---------- */
const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [toast, setToast] = useState<{ show: boolean; message: string; variant: "success" | "danger" }>({ show: false, message: "", variant: "success" });
  const [modalState, setModalState] = useState<{ show: boolean; mode: ModalMode; user: UserType | null }>({ show: false, mode: "add", user: null });
  const [formDefaults, setFormDefaults] = useState<FormData>({ name: "", email: "", role: "user" });

  // sidebar mobile
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 992);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // fetch users
  useEffect(() => {
    const controller = new AbortController();
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/users", { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: UserType[] = await res.json();
        setUsers(data);
      } catch (err: any) {
        if (err.name !== "AbortError") setError("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
    return () => controller.abort();
  }, []);

  // modal handlers
  const openAddModal = () => { setFormDefaults({ name: "", email: "", role: "user" }); setModalState({ show: true, mode: "add", user: null }); };
  const openEditModal = (user: UserType) => { setFormDefaults({ name: user.name, email: user.email, role: user.role }); setModalState({ show: true, mode: "edit", user }); };
  const openDeleteModal = (user: UserType) => setModalState({ show: true, mode: "delete", user });
  const closeModal = () => { setModalState({ show: false, mode: "add", user: null }); setFormDefaults({ name: "", email: "", role: "user" }); };

  // toast
  const showToast = (message: string, variant: "success" | "danger" = "success") => { setToast({ show: true, message, variant }); setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000); };

  // CRUD handlers
  const handleAddUser = async (data: FormData) => {
    try {
      const res = await fetch("http://localhost:5000/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Add failed");
      const newUser: UserType = await res.json();
      setUsers([...users, newUser]);
      closeModal();
      showToast("User added successfully", "success");
    } catch { showToast("Failed to add user", "danger"); }
  };
  const handleEditConfirm = async (data: FormData) => {
    if (!modalState.user) return;
    try {
      const res = await fetch(`http://localhost:5000/users/${modalState.user.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Update failed");
      const updatedUser: UserType = await res.json();
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      closeModal();
      showToast("User updated successfully", "success");
    } catch { showToast("Failed to update user", "danger"); }
  };
  const handleDeleteConfirm = async () => {
    if (!modalState.user) return;
    try {
      const res = await fetch(`http://localhost:5000/users/${modalState.user.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setUsers(users.filter(u => u.id !== modalState.user!.id));
      closeModal();
      showToast("User deleted", "success");
    } catch { showToast("Failed to delete user", "danger"); }
  };

  // filtered & pagination
  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const paginate = (num: number) => setCurrentPage(num);
  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (loading) return <div className="d-flex justify-content-center align-items-center min-vh-100"><div className="spinner-border text-success" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="d-flex justify-content-center align-items-center min-vh-100 text-danger">{error}</div>;

  const navItems = [
    { name: "Dashboard", path: "#", icon: <LayoutDashboard size={18} /> },
    { name: "Users", path: "#", icon: <Users size={18} /> },
    { name: "Products", path: "#", icon: <Package size={18} /> },
    { name: "Orders", path: "#", icon: <ShoppingCart size={18} /> },
    { name: "Reports", path: "#", icon: <BarChart3 size={18} /> },
  ];

  const adminUser = users.find(u => u.role === "admin");

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Helmet><title>Admin Dashboard</title></Helmet>


      {/* Main content */}
      <main style={{
        marginLeft: isMobile ? 0 : "250px", padding: isMobile ? "70px 20px 20px 20px" : "30px", width: isMobile ? "100%" : "calc(100% - 250px)", transition: "0.3s"
      }}>
        {/* Toast */}
        {toast.show && (
          <div style={{ position: "fixed", top: 16, right: 16, zIndex: 2000 }}>
            <div className={`toast align-items-center text-bg-${toast.variant === "success" ? "success" : "danger"} border-0 show`} role="alert">
              <div className="d-flex">
                <div className="toast-body">{toast.message}</div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast(t => ({ ...t, show: false }))}></button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 fw-bold text-dark mb-0">Customer Management</h1>
          <button className="btn" style={{ backgroundColor: "#718355", color: "#fff" }} onClick={openAddModal}>
            <i className="bi bi-plus-circle me-2"></i> Add Customer
          </button>
        </div>

        {/* Admin card */}
        {adminUser && (
          <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: "#718355", color: "#fff" }}>
            <div className="card-body p-4 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">{adminUser.name}</h5>
              <div className="text-white-50">Full system access</div>
            </div>
          </div>
        )}

        {/* Users table */}
        <div className="card border-0 shadow-sm p-4">
          <div className="mb-3 d-flex">
            <input type="text" className="form-control me-2" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            {searchTerm && <button className="btn btn-light" onClick={() => setSearchTerm("")}><i className="bi bi-x"></i></button>}
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="bg-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(u)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => openDeleteModal(u)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {currentUsers.length === 0 && <tr><td colSpan={4} className="text-center text-muted">No users found</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav>
            <ul className="pagination justify-content-center mt-3">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={prevPage}>Previous</button>
              </li>
              {pageNumbers.map(num => (
                <li key={num} className={`page-item ${num === currentPage ? "active" : ""}`}>
                  <button className="page-link" onClick={() => paginate(num)}>{num}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={nextPage}>Next</button>
              </li>
            </ul>
          </nav>
        </div>
      </main>

      {/* Modal */}
      <UserModal
        show={modalState.show}
        mode={modalState.mode}
        user={modalState.user}
        defaultValues={formDefaults}
        onClose={closeModal}
        onAdd={handleAddUser}
        onEdit={handleEditConfirm}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
};

export default AdminPage;
