import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Logo from "../../assets/logo.png";
import {
  IoPersonOutline,
  IoCartOutline,
  IoClose,
  IoLogOutOutline,
} from "react-icons/io5";
import { CiMenuFries } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";
import { GoHistory } from "react-icons/go";
import "./MainNavbar.css";

// Types
interface Category {
  name: string;
  path: string;
}

interface MainNavbarProps {
  onLogout: () => void;
  userName: string;
}

type ActiveLinkType = "home" | "products" | "categories";

const MainNavbar: React.FC<MainNavbarProps> = ({
  onLogout,
  userName,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeLink, setActiveLink] = useState<ActiveLinkType>("home");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [storedName, setStoredName] = useState<string>("");
  const [cartCount, setCartCount] = useState<number>(0);
  const [isCartAnimating, setIsCartAnimating] = useState<boolean>(false);

  // Refs for click outside detection
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const categories: Category[] = [
    { name: "Indoor", path: "/categories/indoor" },
    { name: "Outdoor", path: "/categories/outdoor" },
    { name: "Flowering Plants", path: "/categories/flowering" },
    { name: "Bonsai & Miniature Plants", path: "/categories/bonsai_miniature" },
  ];


  const updateCartCount = (): void => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const previousCount = cartCount;
    const newCount = cart.length;

    setCartCount(newCount);


    if (newCount > previousCount) {
      setIsCartAnimating(true);
      setTimeout(() => setIsCartAnimating(false), 600);
    }
  };

  // Load initial values from localStorage
  useEffect(() => {
    const nameFromStorage = localStorage.getItem("userName");
    setStoredName(nameFromStorage || "");
    updateCartCount();
  }, []);

  useEffect(() => {

    const interval = setInterval(() => {
      updateCartCount();
    }, 1000);


    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        updateCartCount();
      }
    };


    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [cartCount]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (isMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = (): void => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogout = (): void => {

    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("cart");
    localStorage.removeItem("orders_state");
    localStorage.removeItem("cart_items");



    setStoredName("");
    setCartCount(0);

    onLogout();


    navigate("/auth/signin", { replace: true });
  };

  const handleCategoryClick = (path: string): void => {
    setActiveLink("categories");
    setIsDropdownOpen(false);
    closeMenu();
    navigate(path);
  };

  const handleLinkClick = (link: ActiveLinkType): void => {
    setActiveLink(link);
    closeMenu();
  };
  return (
    <nav className="navbar navbar-light shadow-sm">
      <div className="container-fluid px-4">
        <div className="navbar-container">
          <Link
            className="navbar-brand d-flex align-items-center"
            to="/home"
            onClick={() => handleLinkClick("home")}
          >
            <img src={Logo} alt="logo" style={{ height: "80px", width: "auto" }} />
          </Link>

          {/* Desktop Nav */}
          <div className="navbar-nav-desktop">
            <Link
              className={`main-navbar ${activeLink === "home" ? "active" : ""}`}
              to="/home"
              onClick={() => handleLinkClick("home")}
            >
              Home
            </Link>
            <Link
              className={`main-navbar ${activeLink === "products" ? "active" : ""}`}
              to="/products"
              onClick={() => handleLinkClick("products")}
            >
              Products
            </Link>
            <div
              ref={categoriesDropdownRef}
              className="nav-item dropdown"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <Link
                to="#"
                className={`main-navbar d-flex align-items-center ${activeLink === "categories" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsDropdownOpen(prev => !prev);
                  handleLinkClick("categories");
                }}
              >
                Categories <RiArrowDropDownLine size={22} />
              </Link>
              {isDropdownOpen && (
                <div className="dropdown-menu show">
                  {categories.map((cat: Category) => (
                    <Link
                      key={cat.path}
                      to={cat.path}
                      className="dropdown-item"
                      onClick={() => handleCategoryClick(cat.path)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Icons */}
          <div className="navbar-icons-desktop">
            {storedName && (
              <span className="fw-bold text-success me-2 welcome">
                Welcome, {storedName}
              </span>
            )}



            <Link
              to="/cart"
              className={`btn position-relative btn-cart ${isCartAnimating ? 'cart-animate' : ''}`}
            >
              <IoCartOutline size={26} />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/order" className="btn btn-orders">
              <GoHistory size={26} />
            </Link>

            <Link to="/profile" className="btn position-relative btn-cart">
              <IoPersonOutline size={26} />
            </Link>

            <button
              onClick={handleLogout}
              className="btn btn-logout"
              type="button"
              title="Logout"
            >
              <IoLogOutOutline size={26} />
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="menu-toggle-btn"
            onClick={toggleMenu}
            type="button"
          >
            <CiMenuFries size={28} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu-overlay" onClick={closeMenu}>
            <div
              className="mobile-menu-content"
              ref={mobileMenuRef}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <button
                className="close-menu-btn"
                onClick={closeMenu}
                type="button"
              >
                <IoClose size={32} />
              </button>

              <div className="mobile-nav-links">
                <Link
                  className={`main-navbar-mobile ${activeLink === "home" ? "active" : ""}`}
                  to="/home"
                  onClick={closeMenu}
                >
                  Home
                </Link>

                <Link
                  className={`main-navbar-mobile ${activeLink === "products" ? "active" : ""}`}
                  to="/products"
                  onClick={closeMenu}
                >
                  Products
                </Link>

                <div className="nav-item dropdown">
                  <div
                    className={`main-navbar-mobile d-flex align-items-center justify-content-between ${activeLink === "categories" ? "active" : ""}`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    Categories
                    <RiArrowDropDownLine
                      size={25}
                      style={{
                        transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease"
                      }}
                    />
                  </div>

                  {isDropdownOpen && (
                    <div className="mobile-dropdown-menu">
                      {categories.map((cat: Category) => (
                        <Link
                          key={cat.path}
                          to={cat.path}
                          className="dropdown-item"
                          onClick={() => handleCategoryClick(cat.path)}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mobile-icons mt-3">
                {storedName && (
                  <p className="fw-bold text-success mb-2">
                    Welcome, {storedName}
                  </p>
                )}

                <Link
                  to="/cart"
                  className={`mobile-cart-btn ${isCartAnimating ? 'cart-animate' : ''}`}
                  onClick={closeMenu}
                >
                  <IoCartOutline size={30} /> Cart
                  {cartCount > 0 && (
                    <span className="ms-2 badge bg-success">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/order"
                  className="mobile-order-btn"
                  onClick={closeMenu}
                >
                  <GoHistory size={25} /> Orders
                </Link>

                <Link
                  to="/profile"
                  className="mobile-profile-btn"
                  onClick={closeMenu}
                >
                  <IoPersonOutline size={25} /> Profile
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="mobile-logout-btn"
                  type="button"
                >
                  <IoLogOutOutline size={25} /> Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNavbar;