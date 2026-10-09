import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      return;
    }

    fetch("https://vendly-yqrt.onrender.com/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Not logged in");
        }
        return response.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav>
      <h2>Vendly</h2>

      <div>
        <Link to="/">Home</Link>

        {user ? (
          <>
            {user.role === "admin" ? (
              <Link to="/admin">Admin</Link>
            ) : (
              <>
                <Link to="/cart">Cart</Link>
                <Link to="/orders">Orders</Link>
              </>
            )}

            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;