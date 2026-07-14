import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./pages.css";

function UserEditPage({ registeredUsers = [], onUpdateUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = Number(id);

  const userToEdit = registeredUsers.find((user) => user.id === userId);

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

  useEffect(() => {
    if (userToEdit) {
      setFormValues({
        fullName: userToEdit.fullName || "",
        email: userToEdit.email || "",
        username: userToEdit.username || "",
        mobile: userToEdit.mobile || "",
        userType: userToEdit.userType || "Customer",
        village: userToEdit.village || "",
        address: userToEdit.address || "",
        state: userToEdit.state || "",
        pincode: userToEdit.pincode || "",
      });
    }
  }, [userToEdit]);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdateUser?.(userId, formValues);
    navigate("/users");
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
            <button type="submit" className="page-btn">
              Save changes
            </button>
            <button type="button" className="page-btn secondary" onClick={() => navigate("/users")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserEditPage;
