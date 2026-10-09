
function ProductCard({ product }) {
  const addToCart = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please log in before adding items to cart.");
      return;
    }

    try {
      const response = await fetch(
        "https://vendly-yqrt.onrender.com/cart/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity: 1,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        alert("Added to cart!");
      } else {
        alert(
          typeof data.detail === "string"
            ? data.detail
            : "Could not add to cart (" + response.status + ")"
        );
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Could not connect to the server. Please try again.");
    }
  };

  return (
    <div className="product-card">
      {product.image_url ? (
        <img
          className="product-image"
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div className="product-image-placeholder">
          No image available
        </div>
      )}

      <div className="product-card-content">
        <h2>{product.name}</h2>

        <p>{product.description}</p>

        <h3>₹{Number(product.price).toFixed(2)}</h3>

        <p>Stock: {product.stock}</p>

        <button
          onClick={addToCart}
          disabled={product.stock <= 0}
        >
          {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
