import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./pages.css";
import API from "../api/api";

function UserEditPage({ registeredUsers = [], onUpdateUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = id;

  const [loadingUser, setLoadingUser] = useState(true);
  const [userToEdit, setUserToEdit] = useState(null);

  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    username: "",
    mobile: "",
    userType: "Customer",
    village: "",
    address: "",
    state: "",
    pincode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function fetchUser() {
      setLoadingUser(true);
      // try find in registeredUsers first
      const found = registeredUsers.find((u) => u._id === userId || u.id === userId);
      if (found) {
        if (!mounted) return;
        setUserToEdit(found);
        setFormValues({
          fullName: found.fullName || "",
          email: found.email || "",
          username: found.username || "",
          mobile: found.mobile || "",
          userType: found.userType || "Customer",
          village: found.village || "",
          address: found.address || "",
          state: found.state || "",
          pincode: found.pincode || "",
        });
        setLoadingUser(false);
        return;
      }

      try {
        const res = await API.get(`/users/${userId}`);
        const data = res.data || res;
        const u = data.user || data;
        if (!mounted) return;
        setUserToEdit(u);
        setFormValues({
          fullName: u.fullName || "",
          email: u.email || "",
          username: u.username || "",
          mobile: u.mobile || "",
          userType: u.userType || "Customer",
          village: u.village || "",
          address: u.address || "",
          state: u.state || "",
          pincode: u.pincode || "",
        });
      } catch (err) {
        // leave userToEdit null
      } finally {
        if (mounted) setLoadingUser(false);
      }
    }

    fetchUser();
    return () => (mounted = false);
  }, [userId, registeredUsers]);

  if (loadingUser) {
    return (
      <div className="page-shell">
        <div className="page-card">Loading user...</div>
      </div>
    );
  }

  if (!userToEdit) {
    return (
      <div className="page-shell">
        <div className="page-card">
          <h1>User not found</h1>
          <p>The user you are trying to edit does not exist or was removed.</p>
          <button className="page-btn" type="button" onClick={() => navigate("/users")}>Back to users</button>
        </div>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await API.put(`/users/${userId}`, formValues);
      const data = res.data || res;
      if (data.success) {
        onUpdateUser?.(userId, data.user || formValues);
        navigate("/users");
      } else {
        setSubmitError(data.message || "Update failed");
      }
    } catch (e) {
      setSubmitError(e?.response?.data?.message || e.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="page-shell">
      <div className="page-card">
        <div className="page-heading-row">
          <div>
            <h1>Edit User</h1>
            <p>Update the registered user information and save the changes.</p>
          </div>
          <span className="highlight-pill">ID: {userId}</span>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <span>Full Name</span>
            <input
              type="text"
              name="fullName"
              value={formValues.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="form-field">
            <span>Username</span>
            <input
              type="text"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
          </div>

          <div className="form-field">
            <span>Mobile</span>
            <input
              type="tel"
              name="mobile"
              value={formValues.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />
          </div>

          <div className="form-field">
            <span>User Type</span>
            <div className="user-type-toggle">
              <button
                type="button"
                className={`type-option ${formValues.userType === "Farmer" ? "active" : ""}`}
                onClick={() => setFormValues((prev) => ({ ...prev, userType: "Farmer" }))}
              >
                Farmer
              </button>
              <button
                type="button"
                className={`type-option ${formValues.userType === "Customer" ? "active" : ""}`}
                onClick={() => setFormValues((prev) => ({ ...prev, userType: "Customer" }))}
              >
                Customer
              </button>
            </div>
          </div>

          <div className="form-field">
            <span>Village</span>
            <input
              type="text"
              name="village"
              value={formValues.village}
              onChange={handleChange}
              placeholder="Enter village"
            />
          </div>

          <div className="form-field">
            <span>Address</span>
            <input
              type="text"
              name="address"
              value={formValues.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </div>

          <div className="form-field">
            <span>State</span>
            <input
              type="text"
              name="state"
              value={formValues.state}
              onChange={handleChange}
              placeholder="Enter state"
            />
          </div>

          <div className="form-field">
            <span>Pincode</span>
            <input
              type="text"
              name="pincode"
              value={formValues.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="page-btn" disabled={submitting}>
              {submitting ? "Saving..." : "Save changes"}
            </button>
            <button type="button" className="page-btn secondary" onClick={() => navigate("/users")}>Cancel</button>
          </div>
          {submitError && <p className="error">{submitError}</p>}
        </form>
      </div>
    </div>
  );
}

export default UserEditPage;
