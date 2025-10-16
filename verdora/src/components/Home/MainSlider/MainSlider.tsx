// src/components/MainSlider.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./MainSlider.css";

const MainSlider: React.FC = () => {
    return (
        <section className="hero-slider d-flex align-items-center">
            <div className="hero-overlay"></div>
            <div className="container text-white position-relative z-3">
                <h1 className="display-4 fw-bold mb-3">Welcome To Verdora</h1>
                <p className="fs-5 mb-4">Discover our exclusive collection of rare plants.</p>
                <Link to="/products" className="btn btn-light btn-lg fw-medium hero-btn">
                    Shop Now
                </Link>
            </div>
        </section>
    );
};

export default MainSlider;
