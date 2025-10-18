import type { Product } from "./Hooks";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";
import "../components/Home/ExploreProducts/ExploreProducts.css";
import "../styles/global.css";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export default function ProductsCard({ product, onClick }: ProductCardProps) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  const { name, image, price, oldprice } = product;

  const extractNumber = (value: string | undefined): number => {
    if (!value) return 0;
    const match = value.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  const old = extractNumber(product.oldprice);
  const current = extractNumber(product.price);

  const discountPercentage =
    old && current ? Math.round(((old - current) / old) * 100) : 0;

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div
        className="product-card-explore text-center"
        style={{
          border: "none",
          fontFamily: "var(--font-family-serif)",
          color: "var(--color-green-darkest)",
          // height:"370px"
        }}
      >
        <div className="product-image-wrapper-explore">
          <img
            src={image}
            className="card-img-top product-image-explore"
            alt="..."
            onClick={onClick}
            style={{ cursor: "pointer" }}
          />

          {oldprice && <span className="badge onsale">SALE</span>}

          {discountPercentage > 0 && (
            <>
              <span className="badge discount">-{discountPercentage}%</span>
            </>
          )}
          <button className="add-to-cart-overlay" onClick={handleAddToCart}>
            {" "}
            Add to Cart
          </button>
        </div>

        <div>
          <div className="product-info-explore">
            <h5 className="card-title fw-bold  product-name-explore">
              {" "}
              {name ? name.split(" ").splice(0, 2).join(" ") : "No title"}
            </h5>
            <div>
              <p className="product-price-explore">{price}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
