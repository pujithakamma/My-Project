import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./Registration.css";

function Registration({ onRegister }) {
  const initialForm = {
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: "",
    userType: "",
    address: "",
    village: "",
    state: "",
    pincode: "",
    farmName: "",
    crops: "",
    profile: "",
    terms: false,
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(formData.password)) {
      newErrors.password = "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.userType) {
      newErrors.userType = "Please select User Type";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.village.trim()) {
      newErrors.village = "Village/City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
    }

    if (formData.userType === "Farmer") {
      if (!formData.farmName.trim()) {
        newErrors.farmName = "Farm Name is required";
      }

      if (!formData.crops.trim()) {
        newErrors.crops = "Please enter crops grown";
      }
    }

    if (!formData.terms) {
      newErrors.terms = "Please accept Terms & Conditions";
    }

    return newErrors;
  }

  async function fetchUsers() {
    setUsersLoading(true);
    setUsersError("");
    try {
      const res = await API.get("/users");
      const data = res.data || res;
      setUsersList(Array.isArray(data.users) ? data.users : data.users || []);
    } catch (err) {
      setUsersError(err?.response?.data?.message || err.message || "Failed to load users");
      setUsersList([]);
    } finally {
      setUsersLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess("");
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccess("");

    const userData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      mobile: formData.mobile.trim(),
      gender: formData.gender,
      dob: formData.dob,
      userType: formData.userType,
      address: formData.address.trim(),
      village: formData.village.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
      farmName: formData.farmName.trim(),
      crops: formData.crops.trim(),
      profile: formData.profile,
    };

    try {
      const res = await API.post("/users/register", userData);
      const response = res.data || res;
      if (response.success) {
        setSuccess("Registration successful!");
        setSubmittedData(response.user);
        setFormData(initialForm);
        onRegister?.(response.user);
        // refresh users list
        await fetchUsers();
        // navigate to login after successful registration
        navigate("/login");
      } else {
        setErrors({ submit: response.message || "Registration failed" });
      }
    } catch (error) {
      console.error("register error", error);
      const msg = error?.response?.data?.message || error?.message || "Registration failed. Please try again.";
      setErrors({ submit: msg });
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setFormData(initialForm);
    setErrors({});
    setSuccess("");
    setSubmittedData(null);
  }

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/users/${userId}`);
      await fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Delete failed");
    }
  };

  return (
    <div className="register-container">
      <h2>Farm Connect Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
        />
        <p className="error">{errors.fullName}</p>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />
        <p className="error">{errors.email}</p>

        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
        />
        <p className="error">{errors.mobile}</p>

        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <p className="error">{errors.password}</p>

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <p className="error">{errors.confirmPassword}</p>

        <label>Gender</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>Date of Birth</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />

        <label>User Type</label>
        <select name="userType" value={formData.userType} onChange={handleChange}>
          <option value="">Select User Type</option>
          <option value="Farmer">Farmer</option>
          <option value="Customer">Customer</option>
        </select>

        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        <p className="error">{errors.address}</p>

        <input type="text" name="village" placeholder="Village / City" value={formData.village} onChange={handleChange} />
        <p className="error">{errors.village}</p>

        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
        <p className="error">{errors.state}</p>

        <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} />
        <p className="error">{errors.pincode}</p>

        {formData.userType === "Farmer" && (
          <>
            <input type="text" name="farmName" placeholder="Farm Name" value={formData.farmName} onChange={handleChange} />
            <input type="text" name="crops" placeholder="Crops Grown" value={formData.crops} onChange={handleChange} />
            <p className="error">{errors.farmName}</p>
            <p className="error">{errors.crops}</p>
          </>
        )}

        <label>Profile Photo</label>
        <input type="file" name="profile" />

        <div className="terms">
          <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} />
          <label>Accept Terms & Conditions</label>
        </div>

        <p className="error">{errors.terms}</p>

        <div className="btns">
          <button type="submit">Register</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
        {errors.submit && <p className="error">{errors.submit}</p>}
      </form>

      {success && <h3 className="success">{success}</h3>}

      <div style={{ marginTop: 24 }}>
        <h3>Registered Users</h3>
        {usersLoading ? (
          <p>Loading users...</p>
        ) : usersError ? (
          <p className="error">{usersError}</p>
        ) : usersList.length === 0 ? (
          <p>No registered users yet.</p>
        ) : (
          <table className="details-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u._id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.mobile}</td>
                  <td>{u.userType}</td>
                  <td>
                    <button type="button" className="view-btn" onClick={() => navigate(`/users/view/${u._id}`)}>View</button>
                    <button type="button" className="view-btn" onClick={() => navigate(`/users/edit/${u._id}`)}>Edit</button>
                    <button type="button" className="delete-btn" onClick={() => handleDelete(u._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {submittedData && (
        <div className="details">
          <h3>Registration Successful</h3>
          <p><strong>Full Name:</strong> {submittedData.fullName}</p>
          <p><strong>Email:</strong> {submittedData.email}</p>
          <p><strong>Mobile Number:</strong> {submittedData.mobile}</p>
          <p><strong>Gender:</strong> {submittedData.gender}</p>
          <p><strong>Date of Birth:</strong> {submittedData.dob}</p>
          <p><strong>User Type:</strong> {submittedData.userType}</p>
          <p><strong>Address:</strong> {submittedData.address}</p>
          <p><strong>Village / City:</strong> {submittedData.village}</p>
          <p><strong>State:</strong> {submittedData.state}</p>
          <p><strong>Pincode:</strong> {submittedData.pincode}</p>
          {submittedData.userType === "Farmer" && (
            <>
              <p><strong>Farm Name:</strong> {submittedData.farmName}</p>
              <p><strong>Crops Grown:</strong> {submittedData.crops}</p>
            </>
          )}
          <p><strong>Terms Accepted:</strong> Yes</p>
        </div>
      )}
    </div>
  );
}

export default Registration;