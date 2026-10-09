
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://vendly-yqrt.onrender.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("customer");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Login failed");
        return;
      }

      const userResponse = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });

      if (!userResponse.ok) {
        alert("Could not verify your account. Please log in again.");
        return;
      }

      const user = await userResponse.json();

      if (loginType === "admin" && user.role !== "admin") {
        alert("This account is not an admin account.");
        return;
      }

      if (loginType === "customer" && user.role === "admin") {
        alert("Please select Admin Login for this account.");
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      alert("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Welcome to Vendly</h1>

      <div className="login-options">
        <button
          type="button"
          className={loginType === "customer" ? "active" : ""}
          onClick={() => setLoginType("customer")}
        >
          Customer Login
        </button>

        <button
          type="button"
          className={loginType === "admin" ? "active" : ""}
          onClick={() => setLoginType("admin")}
        >
          Admin Login
        </button>
      </div>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : `Login as ${loginType}`}
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link
          to="/signup"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default Login;
