import "../styles/global.css"
import axios from "axios"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  bestseller?: boolean;
  isNew?: boolean;
  image?: string;
  rate?: string;
  category: string;
  oldprice: string;
  [key: string]: unknown;


}

export type {Product};


interface ApiResponse {
  record: {
    products: Product[];
  };
}

export default function UseProducts() {

  const [products, setProducts] = useState <Product[]>([]);
  const [filter, setFilter] = useState <string>(""); 
  const [searchTerm, setSearchTerm] = useState<string>("");
    const navigate = useNavigate();

  


  
   async function getproducts() {
    try {
      const res = await axios.get<ApiResponse>(
        "https://api.jsonbin.io/v3/b/68e56de5d0ea881f4098eaa4/latest"
      );
      console.log(res.data);
      setProducts(res.data.record.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

   const goToDetails = (id: number) => {
    navigate(`/product/${id}`);}

  useEffect (()=>{
     getproducts();
  },[])

  let displayedProducts = products;
  
if (filter === "bestSelling") displayedProducts = products.filter(p => p.bestseller);
if (filter === "newArrival") displayedProducts = products.filter(p => p.isNew);
if (filter === "sale") displayedProducts = products.filter(p => p.oldprice);
if (filter === "alphabetical") displayedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));
if (filter === "priceHighLow") displayedProducts = [...products].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
if (filter === "priceLowHigh") displayedProducts = [...products].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));


  if (searchTerm) {
    displayedProducts = displayedProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }


return {displayedProducts, filter, setFilter, searchTerm, setSearchTerm, goToDetails}
}

