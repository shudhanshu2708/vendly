import { useEffect, useState } from "react";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const token = localStorage.getItem("access_token");

  const fetchProducts = async () => {
    const response = await fetch("http://127.0.0.1:8000/products/");
    const data = await response.json();
    setProducts(data);
  };

  const fetchOrders = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/orders/admin/all",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const addProduct = async (event) => {
    event.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/products/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description,
        price: Number(price),
        stock: Number(stock),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Product added!");

      setName("");
      setDescription("");
      setPrice("");
      setStock("");

      fetchProducts();
    } else {
      alert(data.detail || "Failed to add product");
    }
  };

  const deleteProduct = async (productId) => {
    const response = await fetch(
      `http://127.0.0.1:8000/products/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      alert("Product deactivated!");
      fetchProducts();
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    const response = await fetch(
      `http://127.0.0.1:8000/orders/admin/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: status,
        }),
      }
    );

    if (response.ok) {
      alert("Order status updated!");
      fetchOrders();
    } else {
      const data = await response.json();
      alert(data.detail || "Failed to update order");
    }
  };

  return (
    <div className="admin">
      <h1>Admin Dashboard</h1>

      <h2>Add Product</h2>

      <form onSubmit={addProduct} className="product-form">
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(event) => setStock(event.target.value)}
          required
        />

        <button type="submit">Add Product</button>
      </form>

      <h2>Products</h2>

      {products.map((product) => (
        <div className="admin-card" key={product.id}>
          <h3>{product.name}</h3>
          <p>₹{product.price}</p>
          <p>Stock: {product.stock}</p>

          <button onClick={() => deleteProduct(product.id)}>
            Deactivate
          </button>
        </div>
      ))}

      <h2>Customer Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div className="admin-card" key={order.id}>
            <h3>Order #{order.id}</h3>

            <p>Total: ₹{order.total_amount}</p>

            <p>
              Current status: <strong>{order.status}</strong>
            </p>

            <select
              defaultValue={order.status}
              onChange={(event) =>
                updateOrderStatus(order.id, event.target.value)
              }
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;