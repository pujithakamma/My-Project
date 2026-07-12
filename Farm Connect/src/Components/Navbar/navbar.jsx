import { NavLink } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <span className="brand-icon">🌾</span>
        <span>
          <strong>Farm Connect</strong>
          <small>Grow. Trade. Thrive.</small>
        </span>
      </NavLink>

      <div className="navbar-links">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? "navbar-link active" : "navbar-link")}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="navbar-actions">
        <NavLink
          to="/login"
          className={({ isActive }) => (isActive ? "navbar-action-btn secondary active" : "navbar-action-btn secondary")}
        >
          Login
        </NavLink>
        <NavLink
          to="/register"
          className={({ isActive }) => (isActive ? "navbar-action-btn primary active" : "navbar-action-btn primary")}
        >
          Register
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;