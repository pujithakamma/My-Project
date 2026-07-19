import Sidebar from "../Components/Sidebar/sidebar";
import Hero from "../Components/Hero/Hero";
import StatsCard from "../Components/StatsCard/StatsCard";
import ProductCard from "../Components/ProductCard/ProductCard";
import FeatureCard from "../Components/FeatureCard/Featurecard";
import FarmCard from "../Components/FarmCard/FarmCard";
import "./pages.css";

function HomePage() {
  return (
    <div className="page-shell home-page">
      <div className="container">
        <Sidebar />

        <div className="content">
          <section className="hero-section home-hero">
            <Hero />
            <div className="hero-details">
              <div>
                <p className="eyebrow">🌱 Sustainable food, delivered from farm to table</p>
                <h2>Find fresh produce from trusted local farmers</h2>
                <p className="hero-copy">
                  Discover farm-fresh vegetables, trusted sellers, and secure orders with transparent pricing.
                </p>
                <div className="route-actions hero-actions">
                  <a href="/products" className="page-btn">🌾 Shop Now</a>
                  <a href="/about" className="page-btn secondary">📖 How It Works</a>
                </div>
              </div>
              <div className="hero-badge-grid">
                <div className="hero-badge">
                  <strong>24/7</strong>
                  <span>Fresh updates</span>
                </div>
                <div className="hero-badge">
                  <strong>100% local</strong>
                  <span>Farm-to-door</span>
                </div>
                <div className="hero-badge">
                  <strong>Trusted</strong>
                  <span>Verified sellers</span>
                </div>
              </div>
            </div>
          </section>

          <section className="home-summary-grid">
            <StatsCard title="Farmers" value="150+" />
            <StatsCard title="Customers" value="1200+" />
            <StatsCard title="Products" value="300+" />
          </section>

          <section className="home-cta-banner">
            <div>
              <span className="eyebrow">Limited time offer</span>
              <h3>Save on your first order from local farms.</h3>
              <p>Use code <strong>FARM24</strong> at checkout for extra savings on fresh produce.</p>
            </div>
            <a href="/products" className="page-btn">Browse fresh deals</a>
          </section>

          <section className="home-highlights">
            <div className="highlight-card">
              <strong>🌾 Farm-to-table</strong>
              <p>Local harvests reach your kitchen within hours of picking.</p>
            </div>
            <div className="highlight-card">
              <strong>👨‍🌾 Trusted growers</strong>
              <p>Each crop is sourced from verified farmers in your region.</p>
            </div>
            <div className="highlight-card">
              <strong>📦 Instant delivery</strong>
              <p>Track fresh arrivals, orders, and delivery details easily.</p>
            </div>
          </section>

          <section className="feature-grid">
            <ProductCard
              product={{
              productName: "Tomato",
              price: 40,
            }}
          />

            <ProductCard
              product={{
              productName: "Red Chilli",
              price: 55,
            }}
          />

            <FeatureCard
              title="Live Farm Camera"
              description="Watch your crops 24/7."
          />

            <FeatureCard
              title="Direct Purchase"
              description="Buy directly from farmers."
          />
          </section>

          <section className="story-card">
            <FarmCard farmer="Ramesh" crop="Tomato" status="Growing" />
          </section>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
