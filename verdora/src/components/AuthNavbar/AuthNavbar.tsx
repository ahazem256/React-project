// src/components/AuthNavbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import './AuthNavbar.css'

interface AuthNavbarProps {
    onLogin: () => void;
}

const AuthNavbar: React.FC<AuthNavbarProps> = ({ onLogin }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light shadow-sm">
            <div className="container-fluid px-4">
                {/* Logo على اليسار */}
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <div
                        className="d-flex align-items-center  me-1"
                        style={{
                            width: '40px',
                            height: '40px',
                        }}
                    >

                        <img
                            src={Logo}
                            alt="logo"
                            style={{
                                height: '130px', textAlign: 'center',
                            }}
                        />
                    </div>

                </Link>


                <div className="d-flex gap-2">
                    <Link to="/home"
                        onClick={onLogin}
                        className="btn btn-login"
                        style={{
                            backgroundColor: 'transparent',
                            color: 'var(--color-green-dark)',
                            border: '2px solid var(--color-green-dark)',
                            fontWeight: '500',
                            fontFamily: 'var(--font-family-sans-serif)'
                        }}
                        type="button"
                    >
                        Login
                    </Link>
                    <Link to="/auth/signup" className="btn" type="button"
                        style={{
                            backgroundColor: 'var(--color-green-medium)',
                            color: 'var(--color-green-darkest)',
                            border: 'none',
                            fontWeight: '600',
                            fontFamily: 'var(--font-family-sans-serif)'
                        }}>
                        Register
                    </Link>
                </div>
            </div>
        </nav >
    );
};

export default AuthNavbar;
