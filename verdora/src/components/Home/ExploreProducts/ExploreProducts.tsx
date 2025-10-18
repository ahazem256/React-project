// ExploreProducts.tsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './ExploreProducts.css';
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slices/cartSlice";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";

interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    category: string;
    rate: string;
    stock: string;
}


const fetchProducts = async (): Promise<Product[]> => {
    const res = await axios.get("https://api.jsonbin.io/v3/b/68e56de5d0ea881f4098eaa4/latest");
    return res.data.record.products;
};

const ExploreProducts: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { data: products, isLoading, isError } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
    });

    const handleProductClick = (id: number) => {
        navigate(`/product/${id}`);
    };

    const handleAddToCart = (product: Product) => {
        dispatch(addToCart({ product, quantity: 1 }));
        toast.success(`${product.name} added to cart!`);
    };


    if (isLoading) {
        return (
            <div className="loading-spinner">
                <ClipLoader size={60} color="#5b6d51" />
                <p>Loading products...</p>
            </div>
        );
    }


    if (isError) {
        return <div className="error-message">Failed to load products.</div>;
    }

    return (
        <div className="explore-products">
            <h2 className="explore-title">Explore Our Products</h2>

            <div className="products-grid-explore">
                {products?.slice(0, 8).map((product) => (
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
                                Add to Cart
                            </button>
                        </div>

                        <div className="product-info-explore">
                            <h3 className="product-name-explore">{product.name}</h3>
                            <span className="product-price-explore">{product.price}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="button">
                <Link to="/products" className="btn btn-lg fw-medium pro-btn">
                    View All
                </Link>
            </div>
        </div>
    );
};

export default ExploreProducts;
