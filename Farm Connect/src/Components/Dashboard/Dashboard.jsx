import { useMemo, useState } from "react";
import "./Dashboard.css";

function UserCard({ user }) {
  return (
    <article className="farm-card">
      <div className="farm-card-top">
        <h3>{user.fullName}</h3>
        <span className="farm-chip">{user.userType}</span>
      </div>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Village:</strong> {user.village}</p>
      <p><strong>Farm:</strong> {user.farmName || "N/A"}</p>
      <p><strong>Crops:</strong> {user.crops || "N/A"}</p>
    </article>
  );
}

function Dashboard({ user, users = [], onNavigateToHome, onLogout }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchTerm.toLowerCase();
    const list = users.filter((entry) => {
      const searchableText = `${entry.fullName} ${entry.email} ${entry.village} ${entry.farmName} ${entry.crops}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });

    return [...list].sort((a, b) => {
      if (sortBy === "name") return a.fullName.localeCompare(b.fullName);
      if (sortBy === "village") return a.village.localeCompare(b.village);
      if (sortBy === "type") return a.userType.localeCompare(b.userType);
      return 0;
    });
  }, [searchTerm, sortBy, users]);

  const stats = useMemo(() => {
    const farmerCount = users.filter((entry) => entry.userType === "Farmer").length;
    const villages = new Set(users.map((entry) => entry.village).filter(Boolean)).size;

    return {
      total: users.length,
      farmers: farmerCount,
      villages,
    };
  }, [users]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Farm Connect Dashboard</h1>
          <p>Review registrations, farm activity, and the latest marketplace updates.</p>
        </div>
        <div className="dashboard-actions">
          <button className="dashboard-home" onClick={onNavigateToHome}>
            Home
          </button>
          <button className="dashboard-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {user && (
        <div className="welcome-banner">
          Welcome back, <strong>{user.fullName || user.email}</strong>.
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Records</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Farmers</h3>
          <p>{stats.farmers}</p>
        </div>
        <div className="stat-card">
          <h3>Villages</h3>
          <p>{stats.villages}</p>
        </div>
      </div>

      <div className="dashboard-toolbar">
        <input
          type="text"
          className="dashboard-search"
          placeholder="Search by name, village, or crop"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <select className="dashboard-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="village">Sort by Village</option>
          <option value="type">Sort by Type</option>
        </select>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <h3>No records yet</h3>
          <p>Register a farmer or customer to populate cards and tables here.</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty-state">
          <h3>No matching records</h3>
          <p>Try another search term or sort option.</p>
        </div>
      ) : (
        <>
          <section className="dashboard-grid">
            {filteredUsers.map((entry) => (
              <UserCard key={entry.id} user={entry} />
            ))}
          </section>

          <div className="table-wrapper">
            <h2>Registered Records</h2>
            <table className="records-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Village</th>
                  <th>Farm</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((entry) => (
                  <tr key={`${entry.id}-row`}>
                    <td>{entry.fullName}</td>
                    <td>{entry.email}</td>
                    <td>{entry.userType}</td>
                    <td>{entry.village}</td>
                    <td>{entry.farmName || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
