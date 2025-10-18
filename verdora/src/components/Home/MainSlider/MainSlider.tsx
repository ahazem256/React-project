// src/components/MainSlider.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MainSlider.css";
import img2 from "../../../assets/mainslider2.jpg";
import img1 from "../../../assets/mainslider.jpg";
import img3 from "../../../assets/mainslider3.jpg";

const MainSlider: React.FC = () => {
    const images = [img1, img2, img3];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setNextIndex((currentIndex + 1) % images.length);
            setTimeout(() => {
                setCurrentIndex((currentIndex + 1) % images.length);
            }, 1000);
        }, 2000);

        return () => clearInterval(interval);
    }, [currentIndex, images.length]);

    const goToSlide = (index: number) => {
        if (index !== currentIndex) {
            setNextIndex(index);
            setTimeout(() => {
                setCurrentIndex(index);
            }, 1000);
        }
    };

    return (
        <section className="hero-slider">

            <div
                className="hero-slide active"
                style={{ backgroundImage: `url(${images[currentIndex]})` }}
            />

            <div
                className={`hero-slide next ${nextIndex !== currentIndex ? 'show' : ''}`}
                style={{ backgroundImage: `url(${images[nextIndex]})` }}
            />

            <div className="hero-overlay"></div>

            <div className="hero-content">
                <div className="container text-white position-relative z-3">
                    <h1 className="display-4 fw-bold mb-3">Welcome To Verdora</h1>
                    <p className="fs-5 mb-4">
                        Discover our exclusive collection of rare plants.
                    </p>
                    <Link to="/products" className="btn btn-light btn-lg fw-medium hero-btn">
                        Shop Now
                    </Link>
                </div>
            </div>

            {/* Dots Navigation */}
            <div className="slider-dots">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default MainSlider;