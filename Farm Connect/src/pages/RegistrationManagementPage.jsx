import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../api/api.js";
import "./RegistrationManagementPage.css";

function RegistrationManagementPage({
  registrations: initialRegistrations = [],
  onSelectRegistration = () => {},
  onDeleteRegistration = () => {}
}) {
  const navigate = useNavigate();
  const { registrationId } = useParams();
  
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [sortField, setSortField] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  async function fetchRegistrations(pageNumber = 1) {
  try {
    setLoading(true);

    const queryString = `page=${pageNumber}&limit=${limit}&sort=${sortField}&order=${order}`;

    const response = await API.get(`/users?${queryString}`);

    console.log(response.data.users);

    setRegistrations(response.data.users);
    setTotalPages(response.data.totalPages);

  } catch(error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  fetchRegistrations(page);
}, [page, sortField, order]);

  async function searchRegistrations(value) {
    try {
      setLoading(true);
      const response = await API.get(`/users/search?query=${value}`);
      setRegistrations(response.data.users);
      setPage(1);
      setTotalPages(1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (Array.isArray(initialRegistrations) && initialRegistrations.length > 0) {
      setRegistrations(initialRegistrations);
    }
  }, [initialRegistrations]);

  const selectedRegistration = registrations.find((reg) => {
    const regKey = String(reg._id || reg.id || "");
    const routeKey = String(registrationId || "");
    return regKey === routeKey || String(reg._id || "") === routeKey;
  });

  async function handleSearchSubmit(event) {
    event.preventDefault();

    if (!searchTerm.trim()) {
      setPage(1);
      await fetchRegistrations(1);
      return;
    }
    await searchRegistrations(searchTerm);
  }

  async function deleteRegistration(id) {
    try {
      const response = await API.delete(`/users/${id}`);
      if (response?.data?.success) {
        alert("Registration deleted successfully");
        await fetchRegistrations(page);
        navigate("/registrations/management");
        onDeleteRegistration(id);
      }
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  }

  const handleDeleteRegistration = async (event, registrationId_id) => {
    event.preventDefault();
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this registration?")) {
      await deleteRegistration(registrationId_id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading && registrations.length === 0) {
    return (
      <div className="registration-card">
        <h2>Loading...</h2>
        <p>Please wait while the registration data is loading.</p>
      </div>
    );
  }

  if (registrationId && selectedRegistration) {
    return (
      <div className="registration-card">
        <h2>Registration Details</h2>
        <div className="registration-info">
          <p>
            <strong>ID:</strong> {selectedRegistration._id || selectedRegistration.id}
          </p>
          <p>
            <strong>Name:</strong> {selectedRegistration.fullName || "Unknown"}
          </p>
          <p>
            <strong>Email:</strong> {selectedRegistration.email || "N/A"}
          </p>
          <p>
            <strong>Mobile:</strong> {selectedRegistration.mobile || "N/A"}
          </p>
          <p>
            <strong>User Type:</strong> {selectedRegistration.userType || "N/A"}
          </p>
          <p>
            <strong>Village:</strong> {selectedRegistration.village || "N/A"}
          </p>
          <p>
            <strong>Farm Name:</strong> {selectedRegistration.farmName || "N/A"}
          </p>
          <p>
            <strong>Registered Date:</strong> {formatDate(selectedRegistration.createdAt)}
          </p>
        </div>
        <div className="registration-action-group">
          <button type="button" className="registration-form-button" onClick={() => navigate("/registrations/management")}>
            Back to Registrations
          </button>
          <button
            type="button"
            className="registration-delete-button"
            onClick={(event) => handleDeleteRegistration(event, selectedRegistration._id || selectedRegistration.id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  if (Array.isArray(registrations) && registrations.length > 0) {
  return (
    <div className="registration-card">
      <h2>Registrations List</h2>

      <div className="controls-section">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search registrations..."
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
            <option value="createdAt">Created Date</option>
            <option value="fullName">Full Name</option>
            <option value="email">Email</option>
            <option value="userType">User Type</option>
            <option value="village">Village</option>
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

      <div className="registration-table-wrapper">
        <table className="registration-table">

          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>User Type</th>
              <th>Village</th>
              <th>Registered Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {
              registrations.map((reg, index) => {

                const regKey = reg._id || reg.email || index;

                return (
                  <tr
                    key={regKey}
                    onClick={() => onSelectRegistration(reg)}
                  >

                    <td>
                      {
                        reg.profile ? (
                          <img
                            src={`http://localhost:8000/uploads/${reg.profile}`}
                            alt="profile"
                            width="50"
                            height="50"
                             onLoad={() => console.log("Image loaded:", reg.profile)}
                             onError={() => console.log("Image failed:", reg.profile)}
                          />
                        ) : (
                          "No Image"
                        )
                      }
                    </td>

                    <td>
                      {reg.fullName || "Unknown"}
                    </td>

                    <td>
                      {reg.email || "N/A"}
                    </td>

                    <td>
                      {reg.mobile || "N/A"}
                    </td>

                    <td>
                      <span className={`type-badge ${reg.userType}`}>
                        {reg.userType || "Regular"}
                      </span>
                    </td>

                    <td>
                      {reg.village || "N/A"}
                    </td>

                    <td>
                      {formatDate(reg.createdAt)}
                    </td>

                    <td>

                      <Link
                        to={`/registrations/management/${reg._id}`}
                        className="registration-view-button"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View
                      </Link>

                      <button
                        type="button"
                        className="registration-delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRegistration(e, reg._id);
                        }}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                );

              })
            }
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
  <div className="registration-card">
    <h2>Registration Details</h2>
    <p>No registrations found.</p>
  </div>
);

}

export default RegistrationManagementPage;