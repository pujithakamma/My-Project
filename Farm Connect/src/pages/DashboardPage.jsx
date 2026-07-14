import { NavLink, Outlet } from "react-router-dom";
import "./pages.css";

function DashboardPage({ user, isLoggedIn, onLogout }) {
  const userName = user?.fullName || user?.email || "farmer";

  return (
    <div className="page-shell">
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar-title">Dashboard</div>
          <NavLink to="/dashboard/overview">Home</NavLink>
          <NavLink to="/dashboard/overview">Overview</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/dashboard/profile">Profile</NavLink>
          <NavLink to="/dashboard/orders">Orders</NavLink>
          <NavLink to="/dashboard/live-farms">Live Farms</NavLink>
          <NavLink to="/dashboard/settings">Settings</NavLink>
          <button className="page-btn secondary" onClick={onLogout} style={{ marginTop: 12 }}>
            {isLoggedIn ? "Logout" : "Back to Login"}
          </button>
        </aside>

        <div className="dashboard-main">
          <div className="page-card">
            <h1>Dashboard</h1>
            <p>{isLoggedIn ? `Welcome back, ${userName}.` : `Welcome, ${userName}. Explore the dashboard sections below.`}</p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
