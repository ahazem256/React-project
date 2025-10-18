import React from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  ArrowLeftCircle,
} from "lucide-react";

const Admin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={18} /> },
    { name: "Products", path: "/admin/products", icon: <Package size={18} /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={18} /> },
    { name: "Reports", path: "/admin/reports", icon: <BarChart3 size={18} /> },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>

      <div className="d-flex" style={{ minHeight: "100vh" }}>
        {/* ===== Sidebar ===== */}
        <aside
          className="text-white p-3 shadow-lg"
          style={{
            width: "250px",
            position: "fixed",
            height: "100vh",
            top: 0,
            left: 0,
            background: "linear-gradient(180deg, #718351 0%, #5f6e45 100%)",
          }}
        >
          <h3 className="text-center mb-4 fw-bold text-light border-bottom pb-2">
            Admin Panel
          </h3>

          <ul className="nav flex-column">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item mb-2">
                <Link
                  to={item.path}
                  className={`d-flex align-items-center gap-2 nav-link ${
                    location.pathname === item.path
                      ? "fw-bold bg-light text-dark rounded py-2 px-3 shadow-sm"
                      : "text-white py-2 px-3"
                  }`}
                  style={{
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                  }}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/home")}
            className="btn btn-light text-dark fw-semibold w-100 mt-auto d-flex align-items-center justify-content-center gap-2 shadow-sm"
          >
            <ArrowLeftCircle size={18} /> Back to Website
          </button>
        </aside>

        {/* ===== Main Content ===== */}
        <main
          className="flex-grow-1 bg-light"
          style={{
            marginLeft: "250px",
            padding: "30px",
            minHeight: "100vh",
          }}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Admin;
