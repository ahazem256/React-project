import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store';
import { addToCart } from '../redux/slices/cartSlice';
import type { Product } from '../Types/Products';

const TestCart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const fetchAndAddTestProduct = async () => {
    setLoading(true);
    try {
      // Fetch a random product from FakeStore API
      const response = await fetch('https://fakestoreapi.com/products/1');
      const data = await response.json();
      
      // Transform the data to match our Product interface
      const fakeStoreProduct: Product = {
        id: data.id,
        name: data.title, // Map title to name
        price: data.price.toString(), // Convert number to string
        description: data.description,
        category: data.category,
        image: data.image,
        rate: data.rating.rate.toString() // Map rating to rate string
      };

      setProduct(fakeStoreProduct);
      
      // Add to cart with quantity 1
      dispatch(addToCart({ product: fakeStoreProduct, quantity: 1 }));
      
      console.log('Product added to cart:', fakeStoreProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '20px', borderRadius: '8px' }}>
      <h3>Test Cart with FakeStore API</h3>
      <button 
        onClick={fetchAndAddTestProduct}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Loading...' : 'Add Test Product to Cart'}
      </button>
      
      {product && (
        <div style={{ 
          border: '1px solid #eee', 
          padding: '15px', 
          borderRadius: '4px',
          backgroundColor: '#f9f9f9'
        }}>
          <h4>Added Product:</h4>
          <img 
            src={product.image} 
            alt={product.name}
            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
          />
          <p><strong>Name:</strong> {product.name}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Rating:</strong> {product.rate}/5</p>
        </div>
      )}
    </div>
  );
};

export default TestCart;


/*import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../redux/store";
import { removeFromCart, clearCart } from "../redux/slices/cartSlice";
import { Link } from "react-router-dom";
import TestCart from "../components/TestCart";

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  //handles both string and number prices
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[^\d.]/g, "")) 
      : item.price;
    return sum + price * item.quantity;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <h2>Your cart is empty</h2>
          <Link to="/" style={{ color: "#333", textDecoration: "underline" }}>
            Go Shopping
          </Link>
        </div>
        <TestCart />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ marginBottom: "32px" }}>Your Cart</h1>
      <div>
        {cartItems.map((item) => {
          // Handle both existing and FakeStore API product structures
          const productName = item.name || 'Product';
          const productImage = typeof item.image === 'string' ? item.image : item.image[0] || '';
          const price = typeof item.price === 'string' 
            ? parseFloat(item.price.replace(/[^\d.]/g, "")) 
            : item.price;
          const currency = typeof item.price === 'string' && item.price.includes('EGP') ? 'EGP' : '$';
          
          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "24px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "16px",
              }}
            >
              <img
                src={productImage}
                alt={productName}
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px" }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 8px 0" }}>{productName}</h3>
                <p style={{ margin: "0 0 8px 0", color: "#555" }}>
                  {item.quantity} × {currency}{price.toFixed(2)}
                </p>
                <p style={{ fontWeight: "700", margin: 0 }}>Subtotal: {currency}{(price * item.quantity).toFixed(2)}</p>
              </div>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                style={{
                  backgroundColor: "#f44336",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "32px", textAlign: "right" }}>
        <h2>Total: {totalPrice.toFixed(2)} {cartItems.length > 0 && typeof cartItems[0].price === 'string' && cartItems[0].price.includes('EGP') ? 'EGP' : '$'}</h2>
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "16px" }}>
          <button
            onClick={() => dispatch(clearCart())}
            style={{
              padding: "12px 20px",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Clear Cart
          </button>
          <button
            onClick={() => navigate("/checkout")}
            style={{
              padding: "12px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
      <TestCart />
    </div>
  );
};

export default Cart;
*/


