import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn/>} />
        <Route path="home" element={<Home/>} />
        <Route path="/auth/forget-password" element={<ForgotPassword />} />
        <Route path="/auth/verify-reset-code" element={<VerifyResetCode/>} /> 
        <Route path="/auth/reset-password" element={<ResetPassword/>} />
        <Route path="/auth/signin" element={<SignIn/>} />
        <Route path="/auth/signup" element={<SignUp/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/order" element={<Order/>} />
        <Route path="/productdetails" element={<ProductDetails/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/checkout" element={<Checkout/>}/>
      </Routes>
    </Router>
  );
}
export default App;
