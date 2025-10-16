
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './about.css';


import img1 from '../../../assets/img1.jpg';
import img2 from '../../../assets/img2.jpg';
import img3 from '../../../assets/img3.jpg';
import img4 from '../../../assets/img4.jpg';

const AboutInstagram: React.FC = () => {
    const navigate = useNavigate();

    const instagramImages = [img1, img2, img3, img4];

    const handleLearnMore = () => {
        navigate('/');
    };

    return (
        <div className="about-instagram">
            <div className="instagram-grid">
                <div className="instagram-images">
                    {instagramImages.map((img, index) => (
                        <div key={index} className={`instagram-image-wrapper image-${index + 1}`}>
                            <img src={img} alt={`Plant ${index + 1}`} className="instagram-image" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="instagram-content">
                <h2 className="instagram-title">About Our Store</h2>
                <p className="instagram-description">
                    Verdora — your place for all things green 🌱 Explore beautiful indoor and decorative plants that bring nature into your home.
                </p>
                <button className="instagram-button" onClick={handleLearnMore}>
                    Learn More
                </button>
            </div>
        </div>
    );
};

export default AboutInstagram;