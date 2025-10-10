// src/components/MainNavbar.tsx
import React, { useState } from "react";
import { Link } from 'react-router-dom';

import Logo from '../../assets/logo.png';
import { IoPersonOutline, IoCartOutline } from "react-icons/io5";
import { CiMenuFries } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";
import { GoHistory } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import './MainNavbar.css';

interface MainNavbarProps {
    onLogout: () => void;
    cartCount: number;
}




const MainNavbar: React.FC<MainNavbarProps> = ({ onLogout, cartCount }) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [activeLink, setActiveLink] = useState<string>('home'); // تتبع الـ link النشط
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const categories = [
        { name: "Indoor", path: "/categories/indoor" },
        { name: "Outdoor", path: "/categories/outdoor" },
        { name: "Flowering Plants", path: "/categories/flowering" },
        { name: "Bonsai & Miniature Plants", path: "/categories/bonsai_miniature" },
    ];


    const toggleMenu = (): void => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = (): void => {
        setIsMenuOpen(false);
    };

    const handleLinkClick = (linkName: string): void => {
        setActiveLink(linkName);
        closeMenu();
    };

    return (
        <nav className="navbar navbar-light shadow-sm">
            <div className="container-fluid px-4">
                <div className="navbar-container">
                    {/* Logo */}
                    <Link className="navbar-brand d-flex align-items-center" to="/home">
                        <div
                            className="d-flex align-items-center me-1"
                            style={{
                                width: '40px',
                                height: '40px',
                            }}
                        >
                            <img
                                src={Logo}
                                alt="logo"
                                style={{
                                    height: '130px',
                                    textAlign: 'center',
                                }}
                            />
                        </div>
                    </Link>

                    {/* القائمة الرئيسية - Desktop */}
                    <div className="navbar-nav-desktop">
                        <Link
                            className={`nav-link main-navbar ${activeLink === 'home' ? 'active' : ''}`}
                            to="/home"
                            onClick={() => setActiveLink('home')}
                        >
                            <span className="fw-medium">Home</span>
                        </Link>
                        <Link
                            className={`nav-link main-navbar ${activeLink === 'products' ? 'active' : ''}`}
                            to="/products"
                            onClick={() => setActiveLink('products')}
                        >
                            <span className="fw-medium">Products</span>
                        </Link>
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

                    {/* الأيقونات - Desktop */}
                    <div className="navbar-icons-desktop">
                        <Link to="/cart" className="btn position-relative btn-cart" type="button">
                            <IoCartOutline size={28} />
                            {cartCount > 0 && (
                                <span
                                    className="translate-middle badge rounded-pill"
                                    style={{ backgroundColor: 'var(--color-green-darker)' }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/order" className="btn position-relative btn-order" type="button"
                            onClick={() => setActiveLink('order')}>
                            <GoHistory size={26} />

                        </Link>

                        <Link to="/auth/signin"
                            onClick={onLogout}
                            className="btn btn-logout"
                            style={{
                                color: 'var(--color-green-darkest)'
                            }}
                            type="button"
                        >
                            <IoPersonOutline size={26} />
                        </Link>

                    </div>

                    {/* Toggle Menu Button - Mobile Only */}
                    <button
                        className="menu-toggle-btn"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <CiMenuFries size={28} />
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                    {/* Close Button داخل القائمة */}
                    <button
                        className="close-menu-btn"
                        onClick={closeMenu}
                        aria-label="Close menu"
                    >
                        <IoClose size={32} />
                    </button>

                    <div className="mobile-menu-content">
                        {/* القائمة الرئيسية */}
                        <div className="mobile-nav-links">
                            <Link
                                className={`nav-link main-navbar-mobile ${activeLink === 'home' ? 'active' : ''}`}
                                to="/home"
                                onClick={() => handleLinkClick('home')}
                            >
                                <span className="fw-medium">Home</span>
                            </Link>
                            <Link
                                className={`nav-link main-navbar-mobile ${activeLink === 'products' ? 'active' : ''}`}
                                to="/products"
                                onClick={() => handleLinkClick('products')}
                            >
                                <span className="fw-medium">Products</span>
                            </Link>
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

                        {/* الأيقونات */}
                        <div className="mobile-icons">
                            <Link to="/cart"
                                className="btn position-relative mobile-cart-btn"
                                type="button"
                                onClick={closeMenu}
                            >
                                <IoCartOutline size={30} />
                                <span>Cart</span>
                                {cartCount > 0 && (
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                                        style={{ backgroundColor: 'var(--color-green-darker)' }}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <Link to="/order" className="btn position-relative mobile-order-btn" type="button"
                                onClick={() => setActiveLink('order')}>
                                <GoHistory size={26} />

                            </Link>
                            <Link to="/auth/signin"
                                onClick={() => {
                                    onLogout();
                                    closeMenu();
                                }}
                                className="btn mobile-logout-btn"
                                type="button"
                            >
                                <IoPersonOutline size={30} />
                                <span>Logout</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Overlay للـ Mobile Menu */}
                {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
            </div>
        </nav>
    );
};

export default MainNavbar;