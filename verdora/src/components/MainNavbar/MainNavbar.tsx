import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { IoPersonOutline, IoCartOutline, IoClose, IoLogOutOutline } from "react-icons/io5";
import { MdOutlineManageAccounts } from "react-icons/md";
import { CiMenuFries } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";
import { GoHistory } from "react-icons/go";
import "./MainNavbar.css";

interface MainNavbarProps {
  onLogout: () => void;
  cartCount: number;
  userName: string;
}

const MainNavbar: React.FC<MainNavbarProps> = ({
  onLogout,
  cartCount,
  userName,
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeLink, setActiveLink] = useState<string>("home");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [storedName, setStoredName] = useState<string>("");

  const categories = [
    { name: "Indoor", path: "/categories/indoor" },
    { name: "Outdoor", path: "/categories/outdoor" },
    { name: "Flowering Plants", path: "/categories/flowering" },
    { name: "Bonsai & Miniature Plants", path: "/categories/bonsai_miniature" },
  ];

  useEffect(() => {
    const nameFromStorage = localStorage.getItem("userName");
    setStoredName(nameFromStorage || "");
  }, []);

  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);
  const closeMenu = (): void => setIsMenuOpen(false);

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setStoredName("");
    onLogout();
    navigate("/auth/signin", { replace: true });
  };

  const goToProfile = (): void => {
    if (localStorage.getItem("token")) navigate("/profile");
    else navigate("/auth/signin");
  };

  return (
    <nav className="navbar navbar-light shadow-sm">
      <div className="container-fluid px-4">
        <div className="navbar-container">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center" to="/home">
            <div className="d-flex align-items-center me-1" style={{ width: "40px", height: "40px" }}>
              <img src={Logo} alt="logo" style={{ height: "130px", textAlign: "center" }} />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="navbar-nav-desktop">
            <Link
              className={`nav-link main-navbar ${activeLink === "home" ? "active" : ""}`}
              to="/home"
              onClick={() => setActiveLink("home")}
            >
              <span className="fw-medium">Home</span>
            </Link>
            <Link
              className={`nav-link main-navbar ${activeLink === "products" ? "active" : ""}`}
              to="/products"
              onClick={() => setActiveLink("products")}
            >
              <span className="fw-medium">Products</span>
            </Link>

            <div
              className="nav-item dropdown"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                className={`nav-link main-navbar d-flex align-items-center ${activeLink === "categories" ? "active" : ""}`}
              >
                <span className="fw-medium">Categories</span>
                <RiArrowDropDownLine size={25} />
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu show">
                  {categories.map((cat) => (
                    <Link
                      key={cat.path}
                      to={cat.path}
                      className="dropdown-item"
                      onClick={() => {
                        setActiveLink("categories");
                        setIsDropdownOpen(false);
                      }}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Icons */}
          <div className="navbar-icons-desktop d-flex align-items-center gap-3">
            {storedName && (
              <span className="fw-bold text-success me-2 welcome">Welcome, {storedName}</span>
            )}

            <Link to="/cart" className="btn position-relative btn-cart" type="button">
              <IoCartOutline size={26} />
              {cartCount > 0 && (
                <span
                  className="translate-middle badge rounded-pill"
                  style={{ backgroundColor: "var(--color-green-darker)" }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="user-dropdown">
              <button
                className="btn user-dropdown-toggle btn-person"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                type="button"
                aria-label="User menu"
              >
                <IoPersonOutline size={26} />
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown-menu btn-order">
                  <Link
                    to="/order"
                    className="dropdown-item"
                    onClick={() => {
                      setActiveLink("order");
                      setIsUserMenuOpen(false);
                    }}
                  >
                    <GoHistory size={20} /> <span>Orders</span>
                  </Link>

                  <button
                    onClick={() => {
                      goToProfile();
                      setIsUserMenuOpen(false);
                    }}
                    className="dropdown-item"
                  >
                    <MdOutlineManageAccounts size={20} /> <span>Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="dropdown-item"
                  >
                    <IoLogOutOutline size={20} /> <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Toggle */}
          <button className="menu-toggle-btn" onClick={toggleMenu} aria-label="Toggle menu">
            <CiMenuFries size={28} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
          <button className="close-menu-btn" onClick={closeMenu} aria-label="Close menu">
            <IoClose size={32} />
          </button>

          <div className="mobile-menu-content">
            <div className="mobile-nav-links">
              <Link className={`nav-link main-navbar-mobile ${activeLink === "home" ? "active" : ""}`} to="/home" onClick={closeMenu}>Home</Link>
              <Link className={`nav-link main-navbar-mobile ${activeLink === "products" ? "active" : ""}`} to="/products" onClick={closeMenu}>Products</Link>


              <div
                className="nav-item dropdown"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  className={`nav-link main-navbar d-flex align-items-center ${activeLink === 'categories' ? 'active' : ''
                    }`}
                >
                  <span className="fw-medium">Categories</span>
                  <RiArrowDropDownLine size={25} />
                </button>

                {isDropdownOpen && (
                  <div className="dropdown-menu show">
                    {categories.map((cat) => (
                      <Link
                        key={cat.path}
                        to={cat.path}
                        className="dropdown-item"
                        onClick={() => {
                          setActiveLink('categories');
                          setIsDropdownOpen(false);
                        }}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mobile-icons mt-3">
              {storedName && <p className="fw-bold text-success mb-2">Welcome, {storedName}</p>}

              <Link to="/cart" className="btn position-relative mobile-cart-btn" onClick={closeMenu}>
                <IoCartOutline size={30} />
                <span>Cart</span>
              </Link>

              <Link to="/order" className="btn position-relative mobile-order-btn" onClick={closeMenu}>
                <GoHistory size={25} />
                <span>Orders</span>
              </Link>

              <Link to="/profile" className="btn position-relative mobile-profile-btn" onClick={closeMenu}>
                <IoPersonOutline size={25} />
                <span>Profile</span>
              </Link>

              <button onClick={() => { handleLogout(); closeMenu(); }} className="btn mobile-logout-btn mt-2">
                <IoLogOutOutline size={25} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
      </div>
    </nav>
  );
};

export default MainNavbar;
