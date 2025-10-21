import React from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { addToCart } from "../../../redux/slices/cartSlice";
import "./LowestProducts.css";

interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    category: string;
    rate: string;
    stock: number;
}

const fetchProducts = async (): Promise<Product[]> => {
    const res = await axios.get("http://localhost:5005/products");
    const products = res.data;

    const sorted = products
        .filter((p: Product) => p.price)
        .map((p: Product) => ({
            ...p,
            numericPrice: parseFloat(p.price.replace(" EGP", "")),
        }))
        .sort((a: any, b: any) => a.numericPrice - b.numericPrice);

    return sorted.slice(0, 8);
};

const LowestProducts: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: lowestProducts, isLoading, isError } = useQuery<Product[]>({
        queryKey: ["lowestProducts"],
        queryFn: fetchProducts,
        staleTime: 1000 * 60 * 5,
    });

    const handleAddToCart = (product: Product) => {
        if (!product.stock || product.stock === 0) {
            toast.error(`${product.name} is out of stock!`);
            return;
        }
        dispatch(addToCart({ product, quantity: 1 }));
        toast.success(`${product.name} added to cart!`);
    };

    const NextArrow = (props: any) => {
        const { onClick } = props;
        return (
            <div className="lp-final-arrow-next" onClick={onClick}>
                <FaChevronRight />
            </div>
        );
    };

    const PrevArrow = (props: any) => {
        const { onClick } = props;
        return (
            <div className="lp-final-arrow-prev" onClick={onClick}>
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
            { breakpoint: 1200, settings: { slidesToShow: 3 } },
            { breakpoint: 992, settings: { slidesToShow: 2 } },
            { breakpoint: 576, settings: { slidesToShow: 1 } },
        ],
    };

    if (isLoading) {
        return (
            <div className="lp-final-loading-container">
                <ClipLoader color="#5b6d51" size={60} />
                <p>Loading products...</p>
            </div>
        );
    }

    if (isError) {
        return <p className="lp-final-error-message">Failed to load products. Please try again later.</p>;
    }

    return (
        <div className="lp-final-category-container">
            <h2 className="lp-final-category-slider-title">Lowest Priced Products</h2>

            <div className="lp-final-slider-wrapper">
                <Slider {...settings}>
                    {lowestProducts?.map((p) => (
                        <div key={p.id} className="lp-final-category-slide">
                            <div className="lp-final-image-container">
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    className="lp-final-category-image"
                                    onClick={() => navigate(`/product/${p.id}`)}
                                />
                                <button
                                    className="lp-final-add-cart-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(p);
                                    }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                            <div className="lp-final-details">
                                <h3 className="lp-final-name-explore">{p.name}</h3>
                                <p className="lp-final-price-explore">{p.price}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default LowestProducts;