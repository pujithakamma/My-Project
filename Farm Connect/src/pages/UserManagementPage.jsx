import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../api/api.js";
import "./UserManagementPage.css";

function UserManagementPage({
  users: initialUsers = [],
  onSelectUser = () => {},
  onAddUser = () => {},
  onDeleteUser = () => {}
}) {
  const navigate = useNavigate();
  const { userId } = useParams();
  
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    id: "",
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    village: "",
    farmName: "",
    userType: "",
    address: "",
    state: "",
    pincode: ""
  });
  
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [sortField, setSortField] = useState("fullName");
  const [order, setOrder] = useState("asc");

  async function fetchUsers(pageNumber = 1) {
  try {
    setLoading(true);

    const response = await API.get(
      `/users?search=${searchTerm}&page=${pageNumber}&limit=${limit}&sort=${sortField}&order=${order}`
    );

    setUsers(response.data.users);
    setPage(response.data.page);
    setTotalPages(response.data.totalPages);

  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
}
  async function searchUsers(value) {
    try {
      setLoading(true);
      const response = await API.get(`/users/search?query=${value}`);
      setUsers(response.data.users);
      setPage(1);
      setTotalPages(1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers(page);
  }, [page, sortField, order]);

  useEffect(() => {
    if (Array.isArray(initialUsers) && initialUsers.length > 0) {
      setUsers(initialUsers);
    }
  }, [initialUsers]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (event) => {
    event.preventDefault();

    if (!newUser.fullName.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      alert("Please fill in all required fields (Name, Email, Password)");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/users/register", newUser);
      if (response.data.success) {
        alert("User registered successfully");
        setNewUser({
          id: "",
          fullName: "",
          email: "",
          password: "",
          mobile: "",
          village: "",
          farmName: "",
          userType: "",
          address: "",
          state: "",
          pincode: ""
        });
        setShowForm(false);
        await fetchUsers(1);
        onAddUser(response.data.user);
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const selectedUser = users.find((user) => {
    const userKey = String(user._id || user.id || "");
    const routeKey = String(userId || "");
    return userKey === routeKey || String(user._id || "") === routeKey;
  });

  async function handleSearchSubmit(event) {
  event.preventDefault();
  setPage(1);
  await fetchUsers(1);
}

  async function deleteUser(id) {
    try {
      const response = await API.delete(`/users/${id}`);
      if (response?.data?.success) {
        alert("User deleted successfully");
        await fetchUsers(page);
        navigate("/users/management");
        onDeleteUser(id);
      }
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  }

  async function updateUser(id, updatedData) {
    try {
      const response = await API.put(`/users/${id}`, updatedData);
      if (response?.data?.success) {
        alert("User updated successfully");
        await fetchUsers(page);
      }
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  }

  const handleDeleteUser = async (event, userId_id) => {
    event.preventDefault();
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId_id);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="user-card">
        <h2>Loading...</h2>
        <p>Please wait while the user data is loading.</p>
      </div>
    );
  }

  if (userId && selectedUser) {
    return (
      <div className="user-card">
        <h2>User Details</h2>
        <div className="user-info">
          <p>
            <strong>ID:</strong> {selectedUser._id || selectedUser.id}
          </p>
          <p>
            <strong>Name:</strong> {selectedUser.fullName || "Unknown"}
          </p>
          <p>
            <strong>Email:</strong> {selectedUser.email || "N/A"}
          </p>
          <p>
            <strong>Mobile:</strong> {selectedUser.mobile || "N/A"}
          </p>
          <p>
            <strong>Village:</strong> {selectedUser.village || "N/A"}
          </p>
          <p>
            <strong>Farm Name:</strong> {selectedUser.farmName || "N/A"}
          </p>
          <p>
            <strong>User Type:</strong> {selectedUser.userType || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {selectedUser.address || "N/A"}
          </p>
          <p>
            <strong>State:</strong> {selectedUser.state || "N/A"}
          </p>
          <p>
            <strong>Pincode:</strong> {selectedUser.pincode || "N/A"}
          </p>
        </div>
        <div className="user-action-group">
          <button type="button" className="user-form-button" onClick={() => navigate("/users/management")}>
            Back to Users
          </button>
          <button
            type="button"
            className="user-delete-button"
            onClick={(event) => handleDeleteUser(event, selectedUser._id || selectedUser.id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  if (Array.isArray(users) && users.length > 0) {
    return (
      <div className="user-card">
        <h2>Users List</h2>

        <button type="button" className="user-form-button" onClick={() => navigate("/register")}>
          Add User
        </button>

        <div className="controls-section">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <div className="sort-controls">
            <label>Sort By:</label>
            <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
              <option value="fullName">Full Name</option>
              <option value="email">Email</option>
              <option value="mobile">Mobile</option>
              <option value="village">Village</option>
              <option value="farmName">Farm Name</option>
              <option value="createdAt">Created Date</option>
            </select>

            <label>Order:</label>
            <select value={order} onChange={(e) => setOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {showForm && (
          <form className="user-form" onSubmit={handleAddUser}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={newUser.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={newUser.password}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile"
              value={newUser.mobile}
              onChange={handleChange}
            />
            <input
              type="text"
              name="village"
              placeholder="Village"
              value={newUser.village}
              onChange={handleChange}
            />
            <input
              type="text"
              name="farmName"
              placeholder="Farm Name"
              value={newUser.farmName}
              onChange={handleChange}
            />
            <select name="userType" value={newUser.userType} onChange={handleChange}>
              <option value="">Select User Type</option>
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
              <option value="admin">Admin</option>
            </select>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newUser.address}
              onChange={handleChange}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={newUser.state}
              onChange={handleChange}
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={newUser.pincode}
              onChange={handleChange}
            />
            <button type="submit">Save User</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        )}

        {!showForm && (
          <button type="button" className="user-form-button" onClick={() => setShowForm(true)}>
            Show Form
          </button>
        )}

        <div className="user-table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Village</th>
                <th>Farm Name</th>
                <th>User Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                const userKey = user._id || user.id || "";

                return (
                  <tr
                    key={user._id ?? user.email ?? index}
                    onClick={() => onSelectUser(user)}
                  >
                    <td>
                      <div className="user-table-cell">
                        <strong>{user.fullName || "Unknown"}</strong>
                      </div>
                    </td>
                    <td>
                      <div className="user-table-cell">
                        {user.email || "N/A"}
                      </div>
                    </td>
                    <td>
                      <div className="user-table-cell">{user.mobile || "N/A"}</div>
                    </td>
                    <td>
                      <div className="user-table-cell">{user.village || "N/A"}</div>
                    </td>
                    <td>
                      <div className="user-table-cell">{user.farmName || "N/A"}</div>
                    </td>
                    <td>
                      <div className="user-table-cell">
                        <span className={`type-badge ${user.userType}`}>
                          {user.userType || "Regular"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="user-table-cell user-action-group">
                        <Link
                          to={`/users/management/${userKey}`}
                          className="user-view-button"
                          onClick={(event) => event.stopPropagation()}
                        >
                          View
                        </Link>

                        <Link
                          to={`/users/edit/${userKey}`}
                          className="user-view-button"
                          onClick={(event) => event.stopPropagation()}
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="user-delete-button"
                          onClick={(event) => handleDeleteUser(event, userKey)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination">
            <button
              type="button"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>

            <span>
              {" "}Page {page} of {totalPages} {" "}
            </span>

            <button
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-card">
      <h2>User Details</h2>
      <p>No users found.</p>
    </div>
  );
}

export default UserManagementPage;
