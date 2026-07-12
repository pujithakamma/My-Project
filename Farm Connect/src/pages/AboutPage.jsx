import { Link } from "react-router-dom";
import "./pages.css";

function AboutPage() {
  return (
    <div className="page-shell">
      <div className="page-card">
        <h1>About Farm Connect</h1>
        <p>
          Farm Connect brings farmers and customers together through a simple, transparent marketplace built for rural communities.
        </p>
        <p>
          The platform makes it easier to discover fresh produce, track farm activity, and manage registrations from one place.
        </p>
        <div className="route-actions">
          <Link to="/" className="page-btn">Return Home</Link>
          <Link to="/products" className="page-btn secondary">Browse Products</Link>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
