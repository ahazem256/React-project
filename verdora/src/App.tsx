import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AuthNavbar from "./components/AuthNavbar/AuthNavbar";
import MainNavbar from "./components/MainNavbar/MainNavbar";
import ResetPassword from "./pages/Auth/ResetPassword";
import ForgotPassword from "./pages/Auth/ForgetPassword";
import VerifyResetCode from "./pages/Auth/VerifyResetCode";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Profile from "./pages/profile/Profile";
import Checkout from "./pages/Checkout";
import Indoor from "./pages/categories/Indoor";
import Outdoor from "./pages/categories/Outdoor";
import Flowering from "./pages/categories/Flowering";
import Bonsai_miniature from "./pages/categories/Bonsai_miniature";
import NotFound from "./components/common/NotFound";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Footer from './components/footer/Footer';
import Admin from "./pages/admin";




const AppContent: React.FC = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState<string>(localStorage.getItem("userName") || "");
  const [cartCount, setCartCount] = useState<number>(0);
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("userName");
      setIsAuthenticated(!!token);
      setUserName(name || "");
    };

    window.addEventListener("storage", checkAuth);
    checkAuth(); // initial check
    return () => window.removeEventListener("storage", checkAuth);
  }, [location.pathname]);

  const handleLogin = (token: string, name: string): void => {
    localStorage.setItem("token", token);
    localStorage.setItem("userName", name);
    setUserName(name);
    setIsAuthenticated(true);
  };

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    setUserName("");
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="app-container">
        {/* Navbar */}
        {isAuthenticated ? (
          <MainNavbar onLogout={handleLogout} cartCount={cartCount} userName={userName} />
        ) : (
          <AuthNavbar />
        )}
        <main className="app-content">
          <Routes>
            {/* Redirect root */}
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/auth/signin" replace />}
            />

            {/* Auth Routes */}
           <Route
  path="/auth/signin"
  element={
    isAuthenticated
      ? localStorage.getItem("userRole") === "admin"
        ? <Navigate to="/admin" replace />
        : <Navigate to="/home" replace />
      : <SignIn onLogin={handleLogin} />
  }
/>
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/auth/forget-password" element={<ForgotPassword />} />
            <Route path="/auth/verify-reset-code" element={<VerifyResetCode />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route path="/home" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Home /></ProtectedRoute>} />
            <Route path="/categories/indoor" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Indoor /></ProtectedRoute>} />
            <Route path="/categories/outdoor" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Outdoor /></ProtectedRoute>} />
            <Route path="/categories/flowering" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Flowering /></ProtectedRoute>} />
            <Route path="/categories/bonsai_miniature" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Bonsai_miniature /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Cart /></ProtectedRoute>} />
            <Route path="/order" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Order /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProductDetails /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Products /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Profile /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Checkout /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Admin /></ProtectedRoute>} />
            

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {isAuthenticated && !location.pathname.startsWith("/auth") && <Footer />}
      </div>
    </>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
