// ExploreProducts.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './ExploreProducts.css';
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slices/cartSlice";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { IoHeartOutline, IoHeart } from "react-icons/io5";

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
    const res = await axios.get("http://localhost:5005/products");
    return res.data;
};

const ExploreProducts: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { data: products, isLoading, isError } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
    });

    const [wishlistMap, setWishlistMap] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        try {
            const raw = localStorage.getItem("wishlist_items") || "[]";
            const list = JSON.parse(raw);
            const map: { [key: string]: boolean } = {};
            if (Array.isArray(list)) {
                list.forEach((item: any) => {
                    map[item.id] = true;
                });
            }
            setWishlistMap(map);
        } catch {
            setWishlistMap({});
        }
    }, []);

    const handleProductClick = (id: number) => {
        navigate(`/product/${id}`);
    };

    const handleAddToCart = (product: Product) => {
        dispatch(addToCart({ product, quantity: 1 }));
        toast.success(`${product.name} added to cart!`);
    };

    const toggleWishlist = (product: any, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const raw = localStorage.getItem("wishlist_items") || "[]";
            const list = JSON.parse(raw);
            const items = Array.isArray(list) ? list : [];

            const exists = items.some((p: any) => String(p.id) === String(product.id));
            if (exists) {
                // Remove
                const filtered = items.filter((p: any) => String(p.id) !== String(product.id));
                localStorage.setItem("wishlist_items", JSON.stringify(filtered));
                setWishlistMap(prev => ({ ...prev, [product.id]: false }));
                toast.success(`${product.name} removed from wishlist`);
            } else {

                const item = {
                    id: product.id,
                    title: product.name,
                    price: product.price,
                    image: product.image
                };
                items.push(item);
                localStorage.setItem("wishlist_items", JSON.stringify(items));
                setWishlistMap(prev => ({ ...prev, [product.id]: true }));
                toast.success(`${product.name} added to wishlist`);
            }
            window.dispatchEvent(new Event("wishlistUpdated"));
        } catch {
            toast.error("Could not update wishlist");
        }
    };

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <ClipLoader
                    size={60}
                    color="#5b6d51"
                    cssOverride={{
                        borderColor: 'transparent',
                        borderTopColor: '#5b6d51',
                    }}
                />

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

                            <button
                                className={`wishlist-overlay ${wishlistMap[product.id] ? "added" : ""}`}
                                onClick={(e) => toggleWishlist(product, e)}
                                title={wishlistMap[product.id] ? "Remove from wishlist" : "Add to wishlist"}
                                type="button"
                            >
                                {wishlistMap[product.id] ? (
                                    <IoHeart size={18} />
                                ) : (
                                    <IoHeartOutline size={18} />
                                )}
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
