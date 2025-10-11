import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLeaf } from "react-icons/fa";
import Logo from '../../assets/logo.png';
import "./Footer.css";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-container container-fluid">
                {/* القسم الأول: اللوجو والوصف */}
                <div className="footer-section">
                    <div className="footer-logo">
                        <img
                            src={Logo}
                            alt="logo"
                            style={{
                                height: '100px', width: '220px'
                            }}
                        />
                    </div>
                    <p className="footer-text">
                        Bringing nature closer to you — explore indoor, outdoor, and flowering plants
                        for every home and space.
                    </p>
                </div>

                {/* القسم الثاني: روابط التنقل */}
                <div className="footer-section">
                    <h5 className="footer-title">Quick Links</h5>
                    <ul className="footer-links">
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li className="footer-dropdown">
                            <span className="dropdown-title">Categories ▾</span>
                            <ul className="footer-dropdown-menu">
                                <li><Link to="/categories/indoor">Indoor</Link></li>
                                <li><Link to="/categories/outdoor">Outdoor</Link></li>
                                <li><Link to="/categories/flowering">Flowering</Link></li>
                                <li><Link to="/categories/bonsai_miniature">Bonsai & Miniature</Link></li>
                            </ul>
                        </li>

                    </ul>
                </div>

                {/* القسم الثالث: سوشيال ميديا */}
                <div className="footer-section">
                    <h5 className="footer-title">Follow Us</h5>
                    <div className="footer-social">
                        <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                        <a href="#" aria-label="Instagram"><FaInstagram /></a>
                        <a href="#" aria-label="Twitter"><FaTwitter /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Verdora<FaLeaf size={28} className="footer-leaf" /> All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
