import { useEffect, useMemo, useState } from "react";
import "./pages.css";

const LIVE_FARMS_KEY = "farmConnectLiveFarms";

const sampleFarms = [
  {
    id: 201,
    name: "Green Valley Farm",
    crop: "Tomatoes",
    status: "Growing",
    location: "Prathipadu",
    lastUpdate: "2026-07-12 10:14",
    health: "Excellent",
  },
  {
    id: 202,
    name: "Sunrise Harvest",
    crop: "Red Chilli",
    status: "Harvesting",
    location: "Rajahmundry",
    lastUpdate: "2026-07-12 09:45",
    health: "Good",
  },
  {
    id: 203,
    name: "Riverbank Fields",
    crop: "Organic Rice",
    status: "Irrigating",
    location: "Eluru",
    lastUpdate: "2026-07-12 08:30",
    health: "Healthy",
  },
  {
    id: 204,
    name: "Sunset Carrot Farm",
    crop: "Carrots",
    status: "Sprouting",
    location: "Vijayawada",
    lastUpdate: "2026-07-12 11:20",
    health: "Stable",
  },
];

function DashboardLiveFarms() {
  const [farms, setFarms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LIVE_FARMS_KEY);
      setFarms(stored ? JSON.parse(stored) : sampleFarms);
    } catch (error) {
      console.error("Failed to load live farms", error);
      setFarms(sampleFarms);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(LIVE_FARMS_KEY, JSON.stringify(farms));
    } catch (error) {
      console.error("Failed to save live farms", error);
    }
  }, [farms]);

  const filteredFarms = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return farms.filter((farm) => {
      const matchesStatus = statusFilter === "all" || farm.status === statusFilter;
      const matchesSearch =
        !term ||
        farm.name.toLowerCase().includes(term) ||
        farm.crop.toLowerCase().includes(term) ||
        farm.location.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [farms, searchTerm, statusFilter]);

  const healthCounts = useMemo(
    () => ({
      Excellent: farms.filter((farm) => farm.health === "Excellent").length,
      Good: farms.filter((farm) => farm.health === "Good").length,
      Healthy: farms.filter((farm) => farm.health === "Healthy").length,
      Stable: farms.filter((farm) => farm.health === "Stable").length,
    }),
    [farms]
  );

  const updateHealth = (id, health) => {
    setFarms((prev) => prev.map((farm) => (farm.id === id ? { ...farm, health } : farm)));
  };

  return (
    <div className="page-card">
      <div className="page-heading-row">
        <div>
          <h2>Live Farms</h2>
          <p>Monitor active farms, crop status, and live updates from the network.</p>
        </div>
        <span className="highlight-pill">{farms.length} farms</span>
      </div>

      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search farms by name, crop, or location"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <select className="filter-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="Growing">Growing</option>
          <option value="Harvesting">Harvesting</option>
          <option value="Irrigating">Irrigating</option>
          <option value="Sprouting">Sprouting</option>
        </select>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Excellent</h3>
          <p>{healthCounts.Excellent}</p>
        </div>
        <div className="stat-card">
          <h3>Good</h3>
          <p>{healthCounts.Good}</p>
        </div>
        <div className="stat-card">
          <h3>Healthy</h3>
          <p>{healthCounts.Healthy}</p>
        </div>
        <div className="stat-card">
          <h3>Stable</h3>
          <p>{healthCounts.Stable}</p>
        </div>
      </div>

      {filteredFarms.length === 0 ? (
        <div className="empty-state">No farms match the current search or filter.</div>
      ) : (
        <div className="dashboard-grid">
          {filteredFarms.map((farm) => (
            <article key={farm.id} className="farm-card">
              <div className="farm-card-top">
                <h3>{farm.name}</h3>
                <span className="farm-chip">{farm.status}</span>
              </div>
              <p><strong>Crop:</strong> {farm.crop}</p>
              <p><strong>Location:</strong> {farm.location}</p>
              <p><strong>Health:</strong> {farm.health}</p>
              <p><strong>Updated:</strong> {farm.lastUpdate}</p>
              <div className="route-actions">
                <button type="button" className="page-btn secondary" onClick={() => updateHealth(farm.id, "Excellent")}>Mark Excellent</button>
                <button type="button" className="page-btn secondary" onClick={() => updateHealth(farm.id, "Good")}>Mark Good</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardLiveFarms;
