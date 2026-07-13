import { useMemo, useState } from "react";
import "./pages.css";
import "./UserDetailsPage.css";

function UserDetailsPage({ registeredUsers = [] }) {
  const [filter, setFilter] = useState("all");

  const filteredUsers = useMemo(() => {
    if (filter === "all") return registeredUsers;
    return registeredUsers.filter((user) => user.userType === filter);
  }, [filter, registeredUsers]);

  return (
    <div className="page-shell">
      <div className="page-card">
        <div className="page-heading-row">
          <div>
            <h1>Registered Users</h1>
            <p>All customer and farmer registrations saved from the registration form.</p>
          </div>
          <span className="highlight-pill">{filteredUsers.length} records</span>
        </div>

        <div className="toolbar" style={{ gap: 12, flexWrap: "wrap" }}>
          <label htmlFor="user-filter" style={{ marginRight: 8, fontWeight: 600, color: "#2e7d32" }}>
            Show:
          </label>
          <select
            id="user-filter"
            className="filter-select"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All users</option>
            <option value="Farmer">Farmers</option>
            <option value="Customer">Customers</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="details-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Type</th>
                <th>Village</th>
                <th>State</th>
                <th>Farm Name</th>
                <th>Crops</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: "24px", textAlign: "center", color: "#4b5563" }}>
                    No registered users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    <td>{user.userType}</td>
                    <td>{user.village}</td>
                    <td>{user.state}</td>
                    <td>{user.userType === "Farmer" ? user.farmName || "—" : "—"}</td>
                    <td>{user.userType === "Farmer" ? user.crops || "—" : "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsPage;
