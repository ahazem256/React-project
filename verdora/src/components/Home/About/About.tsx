import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './about.css';

import img1 from '../../../assets/img1.jpg';
import img2 from '../../../assets/img2.jpg';
import img3 from '../../../assets/img3.jpg';
import img4 from '../../../assets/img4.jpg';

const AboutInstagram: React.FC = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement | null>(null);

    const instagramImages = [img1, img2, img3, img4];

    const handleLearnMore = () => {
        navigate('/');
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            className={`about-instagram ${isVisible ? 'visible' : ''}`}
            ref={sectionRef}
        >

            <div className="instagram-grid">
                <div className="instagram-images">
                    {instagramImages.map((img, index) => (
                        <div
                            key={index}
                            className={`instagram-image-wrapper image-${index + 1}`}
                        >
                            <img
                                src={img}
                                alt={`Plant ${index + 1}`}
                                className="instagram-image"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* الكونتنت */}
            <div className="instagram-content">
                <h2 className="instagram-title">About Our Store</h2>
                <p className="instagram-description">
                    At Verdora, we believe that every leaf tells a story.
                    We’re not just selling plants — we’re helping you bring life, calm, and beauty into your space.

                    Our journey started with a simple idea: to make nature closer to everyone. Whether you’re a seasoned plant lover or just starting your green journey, Verdora offers handpicked, healthy plants that thrive in every home and office.

                    We care for every plant like it’s our own — from the soil it grows in to the smile it brings when it reaches your hands.
                    Our mission is to inspire a greener lifestyle, one plant at a time.

                    Let’s grow together with Verdora — where nature meets design.
                </p>
                <button className="instagram-button" onClick={handleLearnMore}>
                    Learn More
                </button>
            </div>
        </div>
    );
};

export default AboutInstagram;
