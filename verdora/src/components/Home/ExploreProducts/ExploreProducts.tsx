// ExploreProducts.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './ExploreProducts.css';
import { FaLeaf } from "react-icons/fa";

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

                // عرض أول 8 منتجات
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

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation(); // منع الانتقال للصفحة عند الضغط على الزرار
        alert(`${product.name} added to cart 🛒`);
    };

    if (loading) {
        return <div className="loading-products">Loading products...</div>;
    }

    return (
        <div className="explore-products">
            <h2 className="explore-title"><FaLeaf size={28} className="footer-leaf" />Explore Our Products</h2>

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
                                onClick={(e) => handleAddToCart(e, product)}
                            >
                                Add to Cart
                            </button>
                        </div>

                        <div className="product-info-explore">
                            <h3 className="product-name-explore">{product.name}</h3>
                            <span className="product-price-explore">{product.price}</span><span className='product-stock-explore'>Stock:{product.stock}</span>
                            <div className="product-rating-explore">{product.rate}</div>
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


