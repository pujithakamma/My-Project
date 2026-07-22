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

  const selectedUser = users.find((user) => {
    const userKey = String(user._id || user.id || "");
    const routeKey = String(userId || "");
    return userKey === routeKey;
  });

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

          <p><strong>ID:</strong> {selectedUser._id}</p>

          <p><strong>Name:</strong> {selectedUser.fullName}</p>

          <p><strong>Email:</strong> {selectedUser.email}</p>

          <p><strong>Mobile:</strong> {selectedUser.mobile}</p>

          <p><strong>Village:</strong> {selectedUser.village}</p>

          <p><strong>Farm Name:</strong> {selectedUser.farmName}</p>

          <p><strong>User Type:</strong> {selectedUser.userType}</p>

          <p><strong>Address:</strong> {selectedUser.address}</p>

          <p><strong>State:</strong> {selectedUser.state}</p>

          <p><strong>Pincode:</strong> {selectedUser.pincode}</p>

        </div>

        <div className="user-action-group">
          <button
            className="user-form-button"
            onClick={() => navigate("/users/management")}
          >
            Back to Users
          </button>

          <button
            className="user-delete-button"
            onClick={(event) =>
              handleDeleteUser(event, selectedUser._id)
            }
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

      <button
        type="button"
        className="user-form-button"
        onClick={() => navigate("/register")}
      >
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

          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="fullName">Full Name</option>
            <option value="email">Email</option>
            <option value="mobile">Mobile</option>
            <option value="village">Village</option>
            <option value="farmName">Farm Name</option>
            <option value="createdAt">Created Date</option>
          </select>

          <label>Order:</label>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Image</th>
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
              const userKey = user._id || user.id;

              return (
                <tr
                  key={user._id ?? user.email ?? index}
                  onClick={() => onSelectUser(user)}
                >
                  <td>
                    <img
                      src={`http://localhost:5000/uploads/${
                        user.image === "default"
                          ? "default.png"
                          : user.image
                      }`}
                      alt="Profile"
                      width="50"
                      height="50"
                      style={{ borderRadius: "50%" }}
                    />
                  </td>

                  <td>
                    <strong>{user.fullName || "Unknown"}</strong>
                  </td>

                  <td>{user.email || "N/A"}</td>

                  <td>{user.mobile || "N/A"}</td>

                  <td>{user.village || "N/A"}</td>

                  <td>{user.farmName || "N/A"}</td>

                  <td>
                    <span className={`type-badge ${user.userType}`}>
                      {user.userType || "Regular"}
                    </span>
                  </td>

                  <td>
                    <div className="user-action-group">
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
                        onClick={(event) =>
                          handleDeleteUser(event, userKey)
                        }
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
            Page {page} of {totalPages}
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