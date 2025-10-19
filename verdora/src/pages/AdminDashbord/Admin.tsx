import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
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

const Admin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={18} /> },
    { name: "Products", path: "/admin/products", icon: <Package size={18} /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={18} /> },
    { name: "Reports", path: "/admin/reports", icon: <BarChart3 size={18} /> },
  ];

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 992);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const handleNavClick = () => { if (isMobile) closeSidebar(); };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>

      <div className="d-flex" style={{ minHeight: "100vh" }}>
        {/* Mobile Header */}
        {isMobile && (
          <header
            className="d-lg-none text-white shadow-sm position-fixed w-100"
            style={{
              background: "linear-gradient(180deg, #718351 0%, #5f6e45 )",
              zIndex: 1040,
              top: 0,
              left: 0,
              padding: "10px 20px",
            }}
          >
            <div className="d-flex justify-content-between align-items-center w-25">
              <button className="btn btn-light btn-sm" onClick={toggleSidebar}>
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h5 className="mb-0 fw-bold text-light">Admin Panel</h5>
              <div style={{ width: "40px" }}></div>
            </div>
          </header>
        )}

        {/* Sidebar overlay for mobile */}
        {isMobile && isSidebarOpen && (
          <div
            className="position-fixed w-100 h-100"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1039, top: 0, left: 0 }}
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`text-white p-3 shadow-lg d-flex flex-column ${
            isMobile ? (isSidebarOpen ? "d-block" : "d-none") : "d-none d-lg-flex"
          }`}
          style={{
            width: isMobile ? "280px" : "250px",
            position: "fixed",
            height: "100vh",
            top: 0,
            left: 0,
            background: "linear-gradient(180deg, #718351 0%, #5f6e45 100%)",
            zIndex: 1040,
            transform: isMobile ? (isSidebarOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <h3 className="text-center fw-bold mb-4 mt-2">Admin Panel</h3>
          <ul className="nav flex-column mb-4">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item mb-2">
                <Link
                  to={item.path}
                  onClick={handleNavClick}
                  className={`d-flex align-items-center gap-2 nav-link ${
                    location.pathname === item.path
                      ? "fw-bold bg-light text-dark rounded py-2 px-3 shadow-sm"
                      : "text-white py-2 px-3"
                  }`}
                  style={{ textDecoration: "none", transition: "all 0.3s" }}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/home")}
            className="btn btn-light text-dark fw-semibold mt-auto d-flex align-items-center justify-content-center gap-2 shadow-sm"
          >
            <ArrowLeftCircle size={18} /> Back to Website
          </button>
        </aside>

        {/* Main Content */}
        <main
          className="flex-grow-1 bg-light"
          style={{
            marginLeft: isMobile ? 0 : "250px",
            padding: isMobile ? "70px 20px 20px 20px" : "30px",
            minHeight: "100vh",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Admin;
