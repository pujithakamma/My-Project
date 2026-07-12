import "./pages.css";

function DashboardProfile({ user }) {
  return (
    <div className="page-card">
      <h2>Profile</h2>
      <p><strong>Name:</strong> {user?.fullName || "Guest"}</p>
      <p><strong>Email:</strong> {user?.email || "N/A"}</p>
      <p><strong>User Type:</strong> {user?.userType || "N/A"}</p>
    </div>
  );
}

export default DashboardProfile;
