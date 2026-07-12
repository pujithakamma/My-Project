import Sidebar from "../Components/Sidebar/sidebar";
import Hero from "../Components/Hero/Hero";
import StatsCard from "../Components/StatsCard/StatsCard";
import ProductCard from "../Components/ProductCard/ProductCard";
import FeatureCard from "../Components/FeatureCard/Featurecard";
import FarmCard from "../Components/FarmCard/FarmCard";
import "./pages.css";

function HomePage() {
  return (
    <div className="page-shell">
      <div className="container">
        <Sidebar />

        <div className="content">
          <section className="hero-section">
            <Hero />
          </section>

          <div className="route-actions">
            <a href="/products" className="page-btn">Explore Products</a>
            <a href="/about" className="page-btn secondary">Learn About Farm Connect</a>
          </div>

          <div className="products-grid" style={{ marginTop: 24 }}>
            <StatsCard title="Farmers" value="150+" />
            <StatsCard title="Customers" value="1200+" />
            <StatsCard title="Products" value="300+" />
          </div>

          <div className="products-grid" style={{ marginTop: 24 }}>
            <ProductCard name="Tomato" price="₹40/kg" />
            <ProductCard name="Red Chilli" price="₹55/kg" />
          </div>

          <div className="products-grid" style={{ marginTop: 24 }}>
            <FeatureCard title="Live Farm Camera" description="Watch your crops 24/7." />
            <FeatureCard title="Direct Purchase" description="Buy directly from farmers." />
          </div>

          <div className="page-card">
            <FarmCard farmer="Ramesh" crop="Tomato" status="Growing" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
