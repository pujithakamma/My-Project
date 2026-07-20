import { useEffect, useState } from "react";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../Components/ErrorMessage/ErrorMessage";
import API from "../api/api";
import "./pages.css";

function DashboardOverview() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalFarmers: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get current user
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem("farmConnectUser");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const [orderResp, farmersResp, productsResp] = await Promise.all([
        API.get("/orders/stats").catch(() => ({ data: { stats: {} } })),
        API.get("/farmers").catch(() => ({ data: { count: 0 } })),
        API.get("/products").catch(() => ({ data: { count: 0 } })),
      ]);

      const orderStats = orderResp.data || {};
      const farmers = farmersResp.data || {};
      const products = productsResp.data || {};

      setStats({
        totalOrders: orderStats.stats?.totalOrders || 0,
        deliveredOrders: orderStats.stats?.deliveredOrders || 0,
        pendingOrders: orderStats.stats?.pendingOrders || 0,
        totalRevenue: orderStats.stats?.totalRevenue || 0,
        totalFarmers: farmers.count || 0,
        totalProducts: products.count || 0,
      });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const currentUser = getCurrentUser();

  return (
    <div className="page-card">
      <div style={{ marginBottom: "30px" }}>
        <h2>📊 Dashboard Overview</h2>
        <p>Welcome back, {currentUser?.fullName || "User"}! Here's a quick summary of your farm activity.</p>
      </div>

      {loading && <LoadingSpinner />}

      {error && <ErrorMessage error={error} onRetry={loadDashboardData} />}

      {!loading && !error && (
        <div className="dashboard-stats-grid">
          {/* Total Orders Card */}
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.totalOrders}</h3>
              <p className="stat-label">Total Orders</p>
            </div>
          </div>

          {/* Delivered Orders Card */}
          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.deliveredOrders}</h3>
              <p className="stat-label">Delivered</p>
            </div>
          </div>

          {/* Pending Orders Card */}
          <div className="stat-card warning">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.pendingOrders}</h3>
              <p className="stat-label">Pending Orders</p>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div className="stat-card info">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3 className="stat-value">₹{stats.totalRevenue}</h3>
              <p className="stat-label">Total Revenue</p>
            </div>
          </div>

          {/* Total Farmers Card */}
          <div className="stat-card primary">
            <div className="stat-icon">👨‍🌾</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.totalFarmers}</h3>
              <p className="stat-label">Active Farmers</p>
            </div>
          </div>

          {/* Total Products Card */}
          <div className="stat-card secondary">
            <div className="stat-icon">🌾</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.totalProducts}</h3>
              <p className="stat-label">Products Listed</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div style={{ marginTop: "40px" }}>
          <div className="dashboard-insights">
            <h3>📈 Quick Insights</h3>
            <ul>
              <li>✨ You have <strong>{stats.totalOrders}</strong> total orders in the system</li>
              <li>🎯 <strong>{stats.deliveredOrders}</strong> orders have been successfully delivered</li>
              <li>⏳ <strong>{stats.pendingOrders}</strong> orders are currently pending</li>
              <li>💸 Total revenue generated: <strong>₹{stats.totalRevenue}</strong></li>
              <li>🤝 <strong>{stats.totalFarmers}</strong> farmers are active on the platform</li>
              <li>🛒 <strong>{stats.totalProducts}</strong> products are currently available</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardOverview;
