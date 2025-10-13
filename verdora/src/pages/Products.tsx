
import "../styles/global.css"
import ProductsCard from "../pages/Productscard";
import UseProducts from './Hooks';
import CardLoader from "../components/CardLoader/CardLoader";
import type { Product } from "./Hooks";
import { useState } from "react";

export default function Products() {
const { displayedProducts, filter, setFilter, searchTerm, setSearchTerm, goToDetails } = UseProducts();

const [currentPage, setCurrentPage]=useState(1)
 const productsPerPage = 12;


   const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = displayedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(displayedProducts.length / productsPerPage);

    const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
    <div style={{height:"200px", width: "100%", backgroundImage:"url('https://i.pinimg.com/1200x/f3/f3/c5/f3f3c5dc5c431735850117080a080708.jpg')", backgroundSize: "cover",  
    backgroundPosition: "center", 
    backgroundRepeat: "no-repeat",opacity: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}>
    
    <h1 className="text-light" style={{fontSize: "60px", fontFamily: "var(--font-family-serif)"}}>HOUSE PLANTS</h1>
    </div>


<div className="container">
    <div style={{display: "flex", justifyContent: "end",  alignItems: "center", gap: 10}} className="mt-3 mb-3">
     <select style={{height: "30px", borderRadius: "5px"}}   value={filter}
  onChange={(e) => setFilter(e.target.value)}
>
  <option value="">Select</option>
  <option value="sale">sale</option>
  <option value="bestSelling">Best Selling</option>
  <option value="newArrival">New Arrival</option>
  <option value="alphabetical">Alphabetically A-Z</option>
  <option value="priceHighLow">Price from High to Low</option>
  <option value="priceLowHigh">Price from Low to High</option>
     </select>
     <input type="text" placeholder="search" style={{height: "30px", borderRadius: "5px", border: "1px solid grey"}}
     value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
     />
    </div>
</div>

<div className="contaier p-5">
<div className="row gy-3">

  {currentProducts.length ? currentProducts.map((product: Product) => (
<ProductsCard product={product} key={product.id}   onClick={() => goToDetails(product.id)} />
)) :  Array.from ({length: 15}).map (() => < CardLoader />)}
  

</div>

 <div style={{ display: "flex", justifyContent: "center", marginTop: "30px", gap: "10px" }}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              style={{
                padding: "8px 14px",
                borderRadius: "5px",
                border: currentPage === index + 1 ? "2px solid #607344" : "1px solid gray",
                background: currentPage === index + 1 ? "#607344" : "#fff",
                color: currentPage === index + 1 ? "#fff" : "#000",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
</div>
    </>
  )
}



