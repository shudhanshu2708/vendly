
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://vendly-yqrt.onrender.com/products/")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load products (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        // API may return an array or an object containing products.
        const items = Array.isArray(data) ? data : data.products;
        setProducts(Array.isArray(items) ? items : []);
      })
      .catch((err) => {
        console.error("Products fetch error:", err);
        setError(err.message || "Could not load products.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <h1>Welcome to Vendly</h1>
        <p>Simple shopping, secure checkout.</p>
      </section>

      <main className="products-page">
        <h1>Products</h1>

        {loading && <p>Loading products...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p>No products available yet.</p>
        )}

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
