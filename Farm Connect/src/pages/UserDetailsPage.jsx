import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./pages.css";
import "./UserDetailsPage.css";
import API from "../api/api";

function UserDetailsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;

    const matchedUser = registeredUsers.find((user) => {
      const username = String(user.username ?? "").toLowerCase();
      const idValue = String(user._id ?? user.id ?? "");
      return idValue === term || username === term;
    });

    setSelectedUser(matchedUser || null);
  };

  const filteredUsers = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    const baseUsers = filter === "all" ? registeredUsers : registeredUsers.filter((user) => user.userType === filter);

    if (!normalizedTerm) return baseUsers;

    return baseUsers.filter((user) => {
      const username = String(user.username ?? "").toLowerCase();
      const idValue = String(user._id ?? user.id ?? "");
      return idValue === normalizedTerm || username.includes(normalizedTerm);
    });
  }, [filter, registeredUsers, searchTerm]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    API.get('/users')
      .then((res) => {
        const data = res.data || {};
        if (mounted) setRegisteredUsers(data.users || []);
      })
      .catch((err) => {
        if (mounted) setError(err?.response?.data?.message || err.message || 'Failed to load users');
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/users/${id}`);
      setRegisteredUsers((prev) => prev.filter((u) => u._id !== id));
      if (selectedUser?.id === id || selectedUser?._id === id) setSelectedUser(null);
    } catch (e) {
      alert(e.response?.data?.message || 'Delete failed');
    }
  };

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

        <form className="toolbar" style={{ gap: 12, flexWrap: "wrap" }} onSubmit={handleSearchSubmit}>
          <input
            type="search"
            className="search-input"
            placeholder="Search by ID or username"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button type="submit" className="page-btn secondary" style={{ minWidth: 120 }}>
            Search
          </button>
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
        </form>

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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: "24px", textAlign: "center", color: "#4b5563" }}>
                    Loading...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: "24px", textAlign: "center", color: "#4b5563" }}>
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
                    <td className="action-cell">
                      <button
                        type="button"
                        className="view-btn"
                        onClick={() => setSelectedUser(user)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="view-btn"
                        onClick={() => navigate(`/users/edit/${user._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedUser && (
          <div className="user-preview-card">
            <h2>User Details</h2>
            <div className="user-preview-grid">
              <div>
                <strong>Name</strong>
                <p>{selectedUser.fullName}</p>
              </div>
              <div>
                <strong>Email</strong>
                <p>{selectedUser.email}</p>
              </div>
              <div>
                <strong>Mobile</strong>
                <p>{selectedUser.mobile}</p>
              </div>
              <div>
                <strong>Type</strong>
                <p>{selectedUser.userType}</p>
              </div>
              <div>
                <strong>Village</strong>
                <p>{selectedUser.village}</p>
              </div>
              <div>
                <strong>State</strong>
                <p>{selectedUser.state}</p>
              </div>
            </div>
            <button type="button" className="secondary-btn" onClick={() => setSelectedUser(null)}>
              Close preview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetailsPage;
