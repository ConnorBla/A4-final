import { useEffect, useState } from "react";
import Product from "../ui/product.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch(import.meta.env.VITE_PROD_GET_ALL);
      const products = await response.json();
      setProducts(products);
    }

    fetchProducts();
  }, []);

  console.log(products);
  return (
    <div className="container my-4">
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-sm-6 col-md-4 col-lg-2 mb-4">
            <Product id={product.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

 