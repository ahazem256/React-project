import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Indoor from "./pages/categories/Indoor";
import Outdoor from "./pages/categories/Outdoor";
import Flowering from "./pages/categories/Flowering";
import Bonsai_miniature from "./pages/categories/Bonsai_miniature";

import NotFound from "./components/common/NotFound";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Toaster } from "react-hot-toast";


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = sessionStorage.getItem("isAuthenticated");
    return saved === "true";
  });

  const [cartCount, setCartCount] = useState<number>(1);

  // تحميل Bootstrap مرة واحدة
  useEffect(() => {
    const bootstrapLink = document.createElement("link");
    bootstrapLink.rel = "stylesheet";
    bootstrapLink.href =
      "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css";
    if (!document.querySelector(`link[href="${bootstrapLink.href}"]`)) {
      document.head.appendChild(bootstrapLink);
    }
  }, []);

  // حفظ حالة تسجيل الدخول في sessionStorage
  useEffect(() => {
    sessionStorage.setItem("isAuthenticated", isAuthenticated.toString());
  }, [isAuthenticated]);

  const handleLogin = (): void => {
    setIsAuthenticated(true);
  };

  const handleLogout = (): void => {
    setIsAuthenticated(false);
  };






  return (
    <>
      <Toaster position="top-right" />

      <Router>
        <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
          {/* Navbar */}
          {!isAuthenticated ? (
            <AuthNavbar onLogin={handleLogin} />
          ) : (
            <MainNavbar onLogout={handleLogout} cartCount={cartCount} />
          )}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<SignIn />} />
            <Route path="/auth/forget-password" element={<ForgotPassword />} />
            <Route path="/auth/verify-reset-code" element={<VerifyResetCode />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/auth/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/categories/indoor" element={<Indoor />} />
            <Route path="/categories/outdoor" element={<Outdoor />} />
            <Route path="/categories/flowering" element={<Flowering />} />
            <Route path="/categories/bonsai_miniature" element={<Bonsai_miniature />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order"
              element={
                <ProtectedRoute>
                  <Order />
                </ProtectedRoute>
              }
            />
            <Route
              path="/productdetails"
              element={
                <ProtectedRoute>
                  <ProductDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </>
  );

};

export default App;
