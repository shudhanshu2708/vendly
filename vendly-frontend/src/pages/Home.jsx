import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://vendly-yqrt.onrender.com/products/")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <section className="hero">
        <h1>Welcome to Vendly</h1>
        <p>Simple shopping, secure checkout.</p>
      </section>

      <main className="products-page">
        <h1>Products</h1>

        <div className="products">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </>
  );
}

export default Home;
