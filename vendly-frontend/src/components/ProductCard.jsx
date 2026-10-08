function ProductCard({ product }) {
  const addToCart = async () => {
    const token = localStorage.getItem("access_token");

    const response = await fetch("http://127.0.0.1:8000/cart/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: product.id,
        quantity: 1,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Added to cart!");
    } else {
      alert(data.detail || "Could not add to cart");
    }
  };

  return (
    <div className="product-card">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <h3>₹{product.price}</h3>
      <p>Stock: {product.stock}</p>

      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;