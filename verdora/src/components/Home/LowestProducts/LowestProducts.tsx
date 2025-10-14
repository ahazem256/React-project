import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight, FaShoppingCart, FaLeaf } from "react-icons/fa";
import "./LowestProducts.css";
import { useNavigate } from "react-router-dom";


interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    category: string;
    rate: string;
    stock: string;
}

const LowestPriceSlider: React.FC = () => {
    const [lowestProducts, setLowestProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("https://api.jsonbin.io/v3/b/68e56de5d0ea881f4098eaa4/latest");
                console.log("API response:", res.data);

                const products = res.data.record.products;

                // ترتيب المنتجات حسب السعر
                const sorted = products
                    .filter((p: Product) => p.price)
                    .map((p: Product) => ({
                        ...p,
                        numericPrice: parseFloat(p.price.replace(" EGP", "")),
                    }))
                    .sort((a: any, b: any) => a.numericPrice - b.numericPrice);

                // أول 8 منتجات فقط
                setLowestProducts(sorted.slice(0, 8));
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        fetchProducts();
    }, []);

    // الأسهم
    const NextArrow = (props: any) => {
        const { onClick } = props;
        return (
            <div className="arrow next" onClick={onClick}>
                <FaChevronRight />
            </div>
        );
    };

    const PrevArrow = (props: any) => {
        const { onClick } = props;
        return (
            <div className="arrow prev" onClick={onClick}>
                <FaChevronLeft />
            </div>
        );
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    const handleAddToCart = (product: Product) => {
        alert(`${product.name} added to cart 🛒`);
    };
    const navigate = useNavigate();
    const handleProductClick = (id: number) => {
        navigate(`/product/${id}`);
    };


    return (
        <div className="category-container category-slider">
            <h2 className="category-slider-title"><FaLeaf size={28} className="footer-leaf" />Lowest Priced Products</h2>
            {lowestProducts.length > 0 ? (
                <Slider {...settings}>
                    {lowestProducts.map((p) => (
                        <div key={p.id} className="category-slide">
                            <div className="image-container">
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    className="category-image"
                                    onClick={() => navigate(`/product/${p.id}`)} // ← هنا بنروح لصفحة التفاصيل
                                    style={{ cursor: "pointer" }}
                                />

                                <button className="add-cart-btn" onClick={() => handleAddToCart(p)}>
                                    <FaShoppingCart className="cart-icon" /> Add to Cart
                                </button>
                            </div>
                            <div className="details">
                                <span className="cat-name">{p.name} </span> <br />
                                <span className="category-rate"> {p.rate}</span><br />
                                <span className="category-price">{p.price}  <span className="stock"> Stock:{p.stock}</span></span>

                            </div>

                        </div>
                    ))}
                </Slider>
            ) : (
                <p>Loading products...</p>
            )}
        </div>
    );
};

export default LowestPriceSlider;
