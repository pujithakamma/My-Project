import { Link } from "react-router-dom";
import "./pages.css";

function NotFoundPage() {
  return (
    <div className="page-shell">
      <div className="container" style={{ justifyContent: "center", textAlign: "center" }}>
        <div className="page-card" style={{ maxWidth: 560, margin: "0 auto" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: 12 }}>404</h1>
          <h2 style={{ marginBottom: 12 }}>Page Not Found</h2>
          <p style={{ marginBottom: 20 }}>
            The page you are looking for does not exist or has been moved.
          </p>
          <Link to="/" className="page-btn">
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
