import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./pages.css";
import API from "../api/api";

function UserViewPage({ registeredUsers = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // try registeredUsers first
    const found = registeredUsers.find((u) => u._id === id || u.id === id);
    if (found) {
      if (mounted) {
        setUser(found);
        setLoading(false);
      }
      return () => (mounted = false);
    }

    API.get(`/users/${id}`)
      .then((res) => {
        const data = res.data || res;
        if (mounted) setUser(data.user || data);
      })
      .catch((err) => setError(err?.response?.data?.message || err.message || "Failed to load user"))
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [id, registeredUsers]);

  if (loading) return <div className="page-shell"><div className="page-card">Loading...</div></div>;
  if (error) return <div className="page-shell"><div className="page-card">{error}</div></div>;
  if (!user) return <div className="page-shell"><div className="page-card">User not found.</div></div>;

  return (
    <div className="page-shell">
      <div className="page-card">
        <div className="page-heading-row">
          <div>
            <h1>User Details</h1>
            <p>Details for registered user</p>
          </div>
          <span className="highlight-pill">{user._id}</span>
        </div>

        <div className="user-detail-grid">
          <div>
            <strong>User ID</strong>
            <p>{user._id || id || "N/A"}</p>
          </div>
          <div>
            <strong>Full name</strong>
            <p>{user.fullName || "N/A"}</p>
          </div>
          <div>
            <strong>Email</strong>
            <p>{user.email}</p>
          </div>
          <div>
            <strong>Mobile</strong>
            <p>{user.mobile}</p>
          </div>
          <div>
            <strong>Type</strong>
            <p>{user.userType}</p>
          </div>
          <div>
            <strong>Village</strong>
            <p>{user.village}</p>
          </div>
          <div>
            <strong>State</strong>
            <p>{user.state}</p>
          </div>
        </div>

        <div className="form-actions">
          <button className="page-btn" onClick={() => navigate(-1)}>Back</button>
          <button className="page-btn secondary" onClick={() => navigate(`/users/edit/${id}`)}>Edit</button>
          <button
            className="page-btn danger"
            disabled={deleting}
            onClick={async () => {
              if (!window.confirm("Delete this user?")) return;
              setDeleting(true);
              try {
                await API.delete(`/users/${id}`);
                navigate("/users");
              } catch (e) {
                setError(e?.response?.data?.message || e.message || "Delete failed");
              } finally {
                setDeleting(false);
              }
            }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserViewPage;
