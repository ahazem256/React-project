// ExploreProducts.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './ExploreProducts.css';
import { FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slices/cartSlice";

interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    category: string;
    rate: string;
    stock: string;
}

const ExploreProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("https://api.jsonbin.io/v3/b/68e56de5d0ea881f4098eaa4/latest");
                const allProducts = res.data.record.products;


                setProducts(allProducts.slice(0, 8));
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleProductClick = (id: number) => {
        navigate(`/product/${id}`);
    };

    const dispatch = useDispatch();

    const handleAddToCart = (product: Product) => {
        dispatch(addToCart({ product, quantity: 1 }));
        toast.success(`${product.name} added to cart!`);
    };
    if (loading) {
        return <div className="loading-products">Loading products...</div>;
    }

    return (
        <div className="explore-products">
            <h2 className="explore-title">Explore Our Products</h2>

            <div className="products-grid-explore">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="product-card-explore"
                        onClick={() => handleProductClick(product.id)}
                    >
                        <div className="product-image-wrapper-explore">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="product-image-explore"
                            />

                            <button
                                className="add-to-cart-overlay"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(product);
                                }}
                            >
                                <FaShoppingCart className="cart-icon" /> Add to Cart
                            </button>

                        </div>

                        <div className="product-info-explore">
                            <h3 className="product-name-explore">{product.name}</h3>
                            <span className="product-price-explore">{product.price}</span>

                        </div>
                    </div>
                ))}
            </div>
            <div className='button'>
                <Link to="/products" className="btn btn-lg fw-medium pro-btn">
                    View All →
                </Link></div>
        </div>
    );
};

export default ExploreProducts;


