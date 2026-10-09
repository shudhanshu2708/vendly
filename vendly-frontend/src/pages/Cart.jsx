import { useEffect, useState } from "react";

function Cart() {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    const token = localStorage.getItem("access_token");

    const response = await fetch("https://vendly-yqrt.onrender.com/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setCart(data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (itemId) => {
    const token = localStorage.getItem("access_token");

    await fetch(`http://127.0.0.1:8000/cart/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchCart();
  };

  const checkout = async () => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(
      "http://127.0.0.1:8000/orders/checkout",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Order placed successfully!");
      fetchCart();
    } else {
      alert(data.detail || "Checkout failed");
    }
  };

  return (
    <div className="cart">
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <h2>{item.product.name}</h2>
              <p>Price: ₹{item.product.price}</p>
              <p>Quantity: {item.quantity}</p>

              <button onClick={() => removeItem(item.id)}>
                Remove
              </button>
            </div>
          ))}

          <button onClick={checkout} className="checkout-button">
            Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
