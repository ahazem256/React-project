import type {Product} from "./Hooks"
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";

interface ProductCardProps {
  product: Product;
   onClick?: () => void;
}

export default function ProductsCard({product, onClick} : ProductCardProps) {

     const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({product, quantity: 1 })); 
  };
    
    const {name, description, image, price, rate} = product
  return (
    
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
  <div className="card text-center" style={{ border: "none", fontFamily: "var(--font-family-serif)", color: "var(--color-green-darkest)"}}>
    <img src={image} className="card-img-top responsive-img" alt="..."
  
  />
    <div className="card-body">
    <h5 className="card-title fw-bold"   onClick={onClick}
      style={{ cursor: "pointer" }}> {name ? name.split(" ").splice(0, 2).join(" ") : "No title"}</h5>
      <p className="card-text">  {description ? description : "No description"}
</p>
       {/* <p className="card-text">{category}</p> */}
      <div className='d-flex justify-content-center'>
        <p>{price} </p>
      </div>
       <p className='text-warning'>{rate}</p>
      <button className="btn add-to-cart-btn border border-black w-75 rounded-0 fs-4" style={{height: "55px", fontFamily: "var(--font-family-serif)", color: "var(--color-green-darkest)"}} onClick={handleAddToCart}> <FaShoppingCart className="cart" style={{ marginRight: "8px", fontSize: "25", color: "var(--color-green-darkest)", marginTop: "-5" }}
      /> add to cart</button>
    </div>
  </div>
</div>

  )
}