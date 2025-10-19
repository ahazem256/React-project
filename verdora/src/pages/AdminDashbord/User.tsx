import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface UserType {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

const fetchUsers = async (): Promise<UserType[]> => {
  const res = await fetch("http://localhost:5005/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

const UsersTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (isLoading)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border" style={{ color: "#071835", width: "3rem", height: "3rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 fw-bold" style={{ color: "#071835" }}>Loading users...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="mb-3" style={{ fontSize: "3rem" }}>⚠️</div>
          <p className="text-danger fw-bold fs-5">Failed to fetch users</p>
          <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="container-fluid px-2 px-md-4 py-3 py-md-5">
      {/* Header Section */}
      <div className="row align-items-center mb-3 mb-md-4 g-3">
        <div className="col-12 col-md-6">
          <h3 className="fw-bold mb-0" style={{ color: "#071835" }}>
            Users List
          </h3>
          <p className="text-muted mb-0 small d-none d-md-block">
            Total: <span className="fw-bold">{users.length}</span> users
          </p>
        </div>
        <div className="col-12 col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-white" style={{ border: "1px solid #071835", borderRadius: "10px 0 0 10px" }}>
              <svg width="16" height="16" fill="#071835" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                border: "1px solid #071835",
                borderLeft: "none",
                borderRadius: "0 10px 10px 0",
                fontSize: "0.95rem"
              }}
            />
            {searchTerm && (
              <button
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                style={{ zIndex: 10 }}
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
              >
                <svg width="16" height="16" fill="#071835" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards - Mobile Only */}
      <div className="row g-2 mb-3 d-md-none">
        <div className="col-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "10px" }}>
            <div className="card-body p-2 text-center">
              <div className="fw-bold" style={{ color: "#071835", fontSize: "1.2rem" }}>{users.length}</div>
              <div className="text-muted" style={{ fontSize: "0.7rem" }}>Total</div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "10px" }}>
            <div className="card-body p-2 text-center">
              <div className="fw-bold text-warning" style={{ fontSize: "1.2rem" }}>{users.filter(u => u.role === 'admin').length}</div>
              <div className="text-muted" style={{ fontSize: "0.7rem" }}>Admins</div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "10px" }}>
            <div className="card-body p-2 text-center">
              <div className="fw-bold text-success" style={{ fontSize: "1.2rem" }}>{users.filter(u => u.role === 'user').length}</div>
              <div className="text-muted" style={{ fontSize: "0.7rem" }}>Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="card shadow-sm border-0 d-none d-md-block" style={{ borderRadius: "12px", overflow: "hidden" }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ backgroundColor: "#071835", color: "white" }}>
              <tr>
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-3">
                      <span className="badge bg-light text-dark border">#{user.id}</span>
                    </td>
                    <td className="px-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2"
                          style={{
                            width: "35px",
                            height: "35px",
                            backgroundColor: "#071835",
                            fontSize: "0.9rem"
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="fw-semibold">{user.name}</span>
                      </div>
                    </td>
                    <td className="text-muted px-3">{user.email}</td>
                    <td className="px-3">
                      <span
                        className={`badge ${
                          user.role === "admin"
                            ? "bg-warning text-dark"
                            : "bg-success-subtle text-success"
                        }`}
                        style={{ padding: "0.4rem 0.8rem", borderRadius: "8px" }}
                      >
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-5">
                    <div style={{ fontSize: "2rem" }}>🔍</div>
                    <div className="mt-2">No users found</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="d-md-none">
        {currentUsers.length > 0 ? (
          currentUsers.map((user) => (
            <div key={user.id} className="card shadow-sm border-0 mb-2" style={{ borderRadius: "10px" }}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center mb-2">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2 flex-shrink-0"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#071835",
                      fontSize: "0.95rem"
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h6 className="mb-0 fw-bold text-truncate me-2">{user.name}</h6>
                      <span className="badge bg-light text-dark border flex-shrink-0" style={{ fontSize: "0.7rem" }}>#{user.id}</span>
                    </div>
                    <p className="text-muted mb-0 small text-truncate">{user.email}</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span
                    className={`badge ${
                      user.role === "admin"
                        ? "bg-warning text-dark"
                        : "bg-success-subtle text-success"
                    }`}
                    style={{ padding: "0.35rem 0.7rem", borderRadius: "8px", fontSize: "0.75rem" }}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card shadow-sm border-0" style={{ borderRadius: "10px" }}>
            <div className="card-body text-center py-5">
              <div style={{ fontSize: "2.5rem" }}>🔍</div>
              <div className="mt-2 text-muted">No users found</div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
        <div className="d-flex justify-content-center align-items-center gap-1 gap-md-2 mt-3 mt-md-4 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-outline-success px-2 px-md-3"
            style={{
              borderRadius: "8px",
              borderColor: "#071835",
              color: "#071835",
              fontSize: "0.9rem"
            }}
          >
            &laquo;
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn ${
                currentPage === i + 1 ? "btn-success" : "btn-outline-success"
              }`}
              style={{
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                padding: "0",
                fontSize: "0.85rem",
                borderColor: "#071835",
                backgroundColor:
                  currentPage === i + 1 ? "#071835" : "transparent",
                color: currentPage === i + 1 ? "#fff" : "#071835",
              }}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="btn btn-outline-success px-2 px-md-3"
            style={{
              borderRadius: "8px",
              borderColor: "#071835",
              color: "#071835",
              fontSize: "0.9rem"
            }}
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersTable;