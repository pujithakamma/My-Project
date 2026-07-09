import { useState } from "react";
import "./Registration.css";

function Registration({ onRegister, onNavigateToLogin }) {
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

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess("");
      return;
    }

    const newUser = {
      id: Date.now(),
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      username: formData.fullName.trim().toLowerCase().replace(/\s+/g, ""),
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
      terms: formData.terms,
    };

    setErrors({});
    setSuccess("Registration successful! Redirecting to login...");
    setSubmittedData(newUser);
    onRegister?.(newUser);
    setFormData(initialForm);

    window.setTimeout(() => {
      onNavigateToLogin?.();
    }, 1200);
  }

  function handleReset() {
    setFormData(initialForm);
    setErrors({});
    setSuccess("");
    setSubmittedData(null);
  }

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
      </form>

      {success && <h3 className="success">{success}</h3>}

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