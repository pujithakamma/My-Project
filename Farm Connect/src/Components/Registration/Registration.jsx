import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../api/api";
import "./Registration.css";

function Registration({ onRegister }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const defaultUserType = searchParams.get("type") || "";

  const initialForm = {
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: "",
    userType: defaultUserType,
    address: "",
    village: "",
    state: "",
    pincode: "",
    farmName: "",
    crops: "",
    profile: null,
    terms: false
  };

  const [formData, setFormData] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const image = files[0];

      setFormData({
        ...formData,
        profile: image
      });

      if (image) {
        setImagePreview(URL.createObjectURL(image));
      }

      return;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Full Name is required";

    if (!formData.email.trim())
      newErrors.email = "Email is required";

    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email";

    if (!formData.mobile.trim())
      newErrors.mobile = "Mobile number required";

    else if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Mobile must contain 10 digits";

    if (!formData.password)
      newErrors.password = "Password required";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.userType)
      newErrors.userType = "Select user type";

    if (!formData.address.trim())
      newErrors.address = "Address required";

    if (!formData.village.trim())
      newErrors.village = "Village required";

    if (!formData.state.trim())
      newErrors.state = "State required";

    if (!formData.pincode.trim())
      newErrors.pincode = "Pincode required";

    if (formData.userType === "Farmer") {
      if (!formData.farmName.trim())
        newErrors.farmName = "Farm name required";

      if (!formData.crops.trim())
        newErrors.crops = "Crops required";
    }

    if (!formData.terms)
      newErrors.terms = "Accept terms and conditions";

    return newErrors;
  }
  async function fetchUsers() {
  setUsersLoading(true);
  setUsersError("");

  try {
    const res = await API.get("/users");

    console.log("Users API Response:", res.data);

    setUsersList(
      Array.isArray(res.data.users)
        ? res.data.users
        : []
    );

  } catch (err) {
    console.log(err);
    setUsersError("Failed to load users");
  } finally {
    setUsersLoading(false);
  }
}
useEffect(() => {
  console.log("Registration component loaded");
  fetchUsers();
}, []);

async function handleSubmit(e) {
  e.preventDefault();

  const validationErrors = validateForm();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setIsLoading(true);
  setErrors({});
  setSuccess("");

  const userData = {
    fullName: formData.fullName.trim(),
    email: formData.email.trim().toLowerCase(),
    mobile: formData.mobile.trim(),
    password: formData.password,
    gender: formData.gender,
    dob: formData.dob,
    userType: formData.userType,
    address: formData.address.trim(),
    village: formData.village.trim(),
    state: formData.state.trim(),
    pincode: formData.pincode.trim(),
    farmName: formData.farmName.trim(),
    crops: formData.crops.trim()
  };


  try {
    const formDataToSend = new FormData();

    Object.keys(userData).forEach((key) => {
      formDataToSend.append(
        key,
        userData[key]
      );
    });


    formDataToSend.append(
      "profile",
       formData.profile
    );


    const res = await API.post(
      "/users/register",
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );


    if (res.data.success) {

      setSuccess(
        "Registration successful!"
      );

      setSubmittedData(
        res.data.user
      );

      setFormData(initialForm);

      setImagePreview("");

      onRegister?.(
        res.data.user
      );


      await fetchUsers();

      navigate("/login");

    } else {

      setErrors({
        submit:
        res.data.message ||
        "Registration failed"
      });

    }


  } catch (error) {

    setErrors({
      submit:
      error?.response?.data?.message ||
      "Registration failed."
    });


  } finally {

    setIsLoading(false);

  }
}
function handleReset() {
  setFormData(initialForm);
  setImagePreview("");
  setErrors({});
  setSuccess("");
  setSubmittedData(null);
}


async function handleDelete(userId) {
  if (!window.confirm("Delete this user?")) return;

  try {
    await API.delete(`/users/${userId}`);
    await fetchUsers();

  } catch (err) {
    alert(
      err?.response?.data?.message ||
      "Delete failed"
    );
  }
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

      <p className="error">
        {errors.fullName}
      </p>


      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
      />

      <p className="error">
        {errors.email}
      </p>


      <input
        type="text"
        name="mobile"
        placeholder="Mobile Number"
        value={formData.mobile}
        onChange={handleChange}
      />

      <p className="error">
        {errors.mobile}
      </p>


      <div className="password-box">

        <input
          type={
            showPassword
            ? "text"
            : "password"
          }
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(!showPassword)
          }
        >
          {
            showPassword
            ? "Hide"
            : "Show"
          }
        </button>

      </div>


      <p className="error">
        {errors.password}
      </p>


      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
      />

      <p className="error">
        {errors.confirmPassword}
      </p>


      <label>Gender</label>

      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
      >
        <option value="">
          Select Gender
        </option>

        <option value="Male">
          Male
        </option>

        <option value="Female">
          Female
        </option>

        <option value="Other">
          Other
        </option>

      </select>


      <label>Date of Birth</label>

      <input
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
      />


      <label>User Type</label>

      <select
        name="userType"
        value={formData.userType}
        onChange={handleChange}
      >

        <option value="">
          Select User Type
        </option>

        <option value="Farmer">
          Farmer
        </option>

        <option value="Customer">
          Customer
        </option>

      </select>


      <p className="error">
        {errors.userType}
      </p>


      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
      />

      <p className="error">
        {errors.address}
      </p>


      <input
        type="text"
        name="village"
        placeholder="Village / City"
        value={formData.village}
        onChange={handleChange}
      />

      <p className="error">
        {errors.village}
      </p>


      <input
        type="text"
        name="state"
        placeholder="State"
        value={formData.state}
        onChange={handleChange}
      />

      <p className="error">
        {errors.state}
      </p>


      <input
        type="text"
        name="pincode"
        placeholder="Pincode"
        value={formData.pincode}
        onChange={handleChange}
      />

      <p className="error">
        {errors.pincode}
      </p>


      {formData.userType === "Farmer" && (
        <>
          <input
            type="text"
            name="farmName"
            placeholder="Farm Name"
            value={formData.farmName}
            onChange={handleChange}
          />

          <p className="error">
            {errors.farmName}
          </p>


          <input
            type="text"
            name="crops"
            placeholder="Crops Grown"
            value={formData.crops}
            onChange={handleChange}
          />

          <p className="error">
            {errors.crops}
          </p>
        </>
      )}
            <label>
        Profile Photo
      </label>

      <input
        type="file"
        name="profile"
        accept="image/*"
        onChange={handleChange}
      />


      {imagePreview && (
        <img
          src={imagePreview}
          alt="Profile Preview"
          width="100"
          height="100"
          style={{
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />
      )}


      <div className="terms">

        <input
          type="checkbox"
          name="terms"
          checked={formData.terms}
          onChange={handleChange}
        />

        <label>
          Accept Terms & Conditions
        </label>

      </div>


      <p className="error">
        {errors.terms}
      </p>


      <div className="btns">

        <button
          type="submit"
          disabled={isLoading}
        >
          {
            isLoading
            ? "Registering..."
            : "Register"
          }
        </button>


        <button
          type="button"
          onClick={handleReset}
        >
          Reset
        </button>

      </div>


      {
        errors.submit && (
          <p className="error">
            {errors.submit}
          </p>
        )
      }

    </form>


    {
      success && (
        <h3 className="success">
          {success}
        </h3>
      )
    }


    <div style={{ marginTop: 24 }}>

      <h3>
        Registered Users
      </h3>


      {
        usersLoading ? (

          <p>
            Loading users...
          </p>

        ) : usersError ? (

          <p className="error">
            {usersError}
          </p>

        ) : usersList.length === 0 ? (

          <p>
            No registered users yet.
          </p>

        ) : (

          <table className="details-table">

            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>


            <tbody>

              {
                usersList.map((user) => (

                  <tr key={user._id}>

                    <td>
                      {user.profile && (
                        <img
                           src={`http://localhost:8000/uploads/${user.profile}`}
                           alt="profile"
                           width="100"
                           height="100"
                           style={{
                            border: "3px solid red",
                             borderRadius: "0",
                             objectFit: "cover",
                             display:"block"
                          }}
                          onLoad={() => console.log("IMAGE LOADED")}
                          onError={() => console.log("IMAGE FAILED")}
                        />
                      )}
                    </td>


                    <td>
                      {user.fullName}
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>
                      {user.mobile}
                    </td>

                    <td>
                      {user.userType}
                    </td>


                    <td>

                      <button
                        type="button"
                        className="view-btn"
                        onClick={() =>
                          navigate(`/users/view/${user._id}`)
                        }
                      >
                        View
                      </button>


                      <button
                        type="button"
                        className="view-btn"
                        onClick={() =>
                          navigate(`/users/edit/${user._id}`)
                        }
                      >
                        Edit
                      </button>


                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(user._id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))
              }

            </tbody>

          </table>

        )
      }

    </div>


    {
      submittedData && (

        <div className="details">

          <h3>
            Registration Successful
          </h3>


          {
            submittedData.profile && (

              <img
                src={`http://localhost:8000/uploads/${submittedData.profile}`}
                alt="profile"
                width="100"
                height="100"
                style={{
                  borderRadius: "50%",
                  objectFit: "cover"
                }}
              />

            )
          }


          <p>
            <strong>Name:</strong>
            {submittedData.fullName}
          </p>


          <p>
            <strong>Email:</strong>
            {submittedData.email}
          </p>


          <p>
            <strong>Mobile:</strong>
            {submittedData.mobile}
          </p>


          <p>
            <strong>User Type:</strong>
            {submittedData.userType}
          </p>


          <p>
            <strong>Address:</strong>
            {submittedData.address}
          </p>


          <p>
            <strong>Village:</strong>
            {submittedData.village}
          </p>


          <p>
            <strong>State:</strong>
            {submittedData.state}
          </p>


          <p>
            <strong>Pincode:</strong>
            {submittedData.pincode}
          </p>


          {
            submittedData.userType === "Farmer" && (
              <>
                <p>
                  <strong>Farm Name:</strong>
                  {submittedData.farmName}
                </p>

                <p>
                  <strong>Crops:</strong>
                  {submittedData.crops}
                </p>
              </>
            )
          }

        </div>

      )
    }

  </div>
);

}

export default Registration;