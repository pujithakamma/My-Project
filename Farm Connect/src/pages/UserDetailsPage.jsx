import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./pages.css";
import "./UserDetailsPage.css";
import API from "../api/api";

function UserDetailsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("fullName");
  const [order, setOrder] = useState("asc");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    fetchUsers(1);
  };
  async function fetchUsers(pageNumber = 1) {
    try {
      setLoading(true);
      const response = await API.get(
  `/users?search=${searchTerm}&page=${pageNumber}&limit=${limit}&sort=${sortField}&order=${order}&filter=${filter}`
);
      setRegisteredUsers(response.data.users);
      setPage(response.data.page);
      setTotalPages(response.data.totalPages);

    } catch (error) {
      setError(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
  fetchUsers(page);
}, [page, searchTerm, sortField, order, limit, filter]);

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
          <span className="highlight-pill">{registeredUsers.length} records</span>
        </div>

        <form className="toolbar" style={{ gap: 12, flexWrap: "wrap" }} onSubmit={handleSearchSubmit}>
          <input
            type="search"
            className="search-input"
            placeholder="Search by ID or username"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button
            type="button"
            className="add-farmer-btn"
            onClick={() => navigate("/register?type=Farmer")}
          >
            Add Farmer
          </button>
          <button
            type="button"
            className="add-customer-btn"
            onClick={() => navigate("/register?type=Customer")}
          >
            Add Customer
          </button>
        <button type="submit">
          Search
        </button> 
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
         <option value="fullName">Name</option>
         <option value="email">Email</option>
         <option value="village">Village</option>
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <label>Show:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
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
                <th>Image</th>
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
              ) : registeredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: "24px", textAlign: "center", color: "#4b5563" }}>
                    No registered users found.
                  </td>
                </tr>
              ) : (
                registeredUsers.map((user)=> (
                  <tr key={user._id || user.id}>
                    <td>
                      {user.profile ? (
                    <img
                      src={`http://localhost:8000/uploads/${user.profile}`}
                      alt="Profile"
                      width="50"
                      height="50"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover"
                     }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
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
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span style={{ margin: "0 15px" }}>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
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
