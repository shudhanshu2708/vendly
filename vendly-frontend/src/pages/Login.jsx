import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("customer");

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Login failed");
      return;
    }

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);

    // Check the user's actual role
    const userResponse = await fetch(
      "http://127.0.0.1:8000/auth/me",
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      }
    );

    const user = await userResponse.json();

    // Make sure selected login type matches actual role
    if (loginType === "admin" && user.role !== "admin") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      alert("This account is not an admin account.");
      return;
    }

    if (loginType === "customer" && user.role === "admin") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      alert("Please use Admin Login for this account.");
      return;
    }

    navigate("/");
    window.location.reload();
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

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}

export default Login;