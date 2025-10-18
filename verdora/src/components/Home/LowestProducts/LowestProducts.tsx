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
    stock: string;
}


const fetchProducts = async (): Promise<Product[]> => {
    const res = await axios.get("https://api.jsonbin.io/v3/b/68e56de5d0ea881f4098eaa4/latest");
    const products = res.data.record.products;


    const sorted = products
        .filter((p: Product) => p.price)
        .map((p: Product) => ({
            ...p,
            numericPrice: parseFloat(p.price.replace(" EGP", "")),
        }))
        .sort((a: any, b: any) => a.numericPrice - b.numericPrice);

    return sorted.slice(0, 8);
};

const LowestPriceSlider: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const { data: lowestProducts, isLoading, isError } = useQuery<Product[]>({
        queryKey: ["lowestProducts"],
        queryFn: fetchProducts,
        staleTime: 1000 * 60 * 5,
    });

    const handleAddToCart = (product: Product) => {
        dispatch(addToCart({ product, quantity: 1 }));
        toast.success(`${product.name} added to cart!`);
    };


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


    if (isLoading) {
        return (
            <div className="loading-container">
                <ClipLoader color="#5b6d51" size={60} />
                <p>Loading products...</p>
            </div>
        );
    }


    if (isError) {
        return <p className="error-message">Failed to load products. Please try again later.</p>;
    }

    return (
        <div className="category-container category-slider">
            <h2 className="category-slider-title">Lowest Priced Products</h2>

            <Slider {...settings}>
                {lowestProducts?.map((p) => (
                    <div key={p.id} className="category-slide">
                        <div className="image-container">
                            <img
                                src={p.image}
                                alt={p.name}
                                className="category-image"
                                onClick={() => navigate(`/product/${p.id}`)}
                                style={{ cursor: "pointer" }}
                            />
                            <button className="add-cart-btn" onClick={() => handleAddToCart(p)}>
                                Add to Cart
                            </button>
                        </div>
                        <div className="details">
                            <h3 className="name-explore">{p.name}</h3>
                            <p className="price-explore">{p.price}</p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default LowestPriceSlider;
