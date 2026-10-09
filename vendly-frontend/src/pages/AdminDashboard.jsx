
import { useEffect, useState } from "react";

const API = "https://vendly-yqrt.onrender.com";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");

  const fetchProducts = async () => {
    try {
      const response = await fetch(API + "/products/");
      const data = await response.json();

      if (response.ok) {
        setProducts(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch products:", data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(API + "/orders/admin/all", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch orders:", data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const addProduct = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API + "/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          price: Number(price),
          stock: Number(stock),
          image_url: imageUrl.trim() || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Product added successfully!");

        setName("");
        setDescription("");
        setPrice("");
        setStock("");
        setImageUrl("");

        await fetchProducts();
      } else {
        alert(
          typeof data.detail === "string"
            ? data.detail
            : "Failed to add product. Check the entered details."
        );
      }
    } catch (error) {
      console.error("Add product error:", error);
      alert("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Deactivate this product?")) {
      return;
    }

    try {
      const response = await fetch(
        API + "/products/" + productId,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response.ok) {
        alert("Product deactivated!");
        await fetchProducts();
      } else {
        const data = await response.json();
        alert(data.detail || "Failed to deactivate product.");
      }
    } catch (error) {
      console.error("Deactivate product error:", error);
      alert("Could not connect to the server.");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        API + "/orders/admin/" + orderId + "/status",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ status: status }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Order status updated!");
        await fetchOrders();
      } else {
        alert(data.detail || "Failed to update order.");
      }
    } catch (error) {
      console.error("Update order error:", error);
      alert("Could not connect to the server.");
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
          placeholder="Product description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <input
          type="number"
          placeholder="Price (INR)"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          min="0.01"
          step="0.01"
          required
        />

        <input
          type="number"
          placeholder="Stock quantity"
          value={stock}
          onChange={(event) => setStock(event.target.value)}
          min="0"
          step="1"
          required
        />

        <input
          type="url"
          placeholder="Product image URL (https://...)"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
        />

        {imageUrl.trim() !== "" && (
          <div>
            <p>Image preview</p>
            <img
              src={imageUrl}
              alt="Product preview"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
              onLoad={(event) => {
                event.currentTarget.style.display = "block";
              }}
              style={{
                width: "150px",
                height: "150px",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>

      <h2>Products ({products.length})</h2>

      <div className="admin-products">
        {products.map((product) => (
          <div className="admin-card" key={product.id}>
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                loading="lazy"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            )}

            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ₹{product.price}</p>
            <p>Stock: {product.stock}</p>

            <button onClick={() => deleteProduct(product.id)}>
              Deactivate
            </button>
          </div>
        ))}
      </div>

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

            <label htmlFor={"order-status-" + order.id}>
              Update status:
            </label>

            <select
              id={"order-status-" + order.id}
              value={order.status}
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