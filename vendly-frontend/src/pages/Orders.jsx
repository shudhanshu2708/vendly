import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("access_token");

      const response = await fetch("https://vendly-yqrt.onrender.com/orders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order.id}>
            <h2>Order #{order.id}</h2>

            <p>Total: ₹{order.total_amount}</p>
            <p>Status: {order.status}</p>

            <h3>Items</h3>

            {order.items.map((item) => (
              <p key={item.id}>
                Product ID: {item.product_id} | Quantity: {item.quantity} |
                Price: ₹{item.price_at_purchase}
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
