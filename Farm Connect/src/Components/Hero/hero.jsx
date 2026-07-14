import TomatoesImage from "../../assets/Products/Tomatoes.jpg";
import "./Hero.css";

function Hero() {
  return (
    <div className="hero">
      <div className="hero-text-block">
        <span className="hero-pill">Fresh from the farm</span>
        <h1>Welcome to Farm Connect</h1>
        <p>
          Fresh vegetables directly from farmers with fast delivery, trusted produce, and easy ordering.
        </p>
        <div className="hero-metrics">
          <div>
            <strong>150+</strong>
            <span>Local farmers</span>
          </div>
          <div>
            <strong>300+</strong>
            <span>Fresh products</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <img src={TomatoesImage} alt="Fresh tomatoes" />
        <div className="hero-visual-card">
          <span>Top seller</span>
          <strong>Fresh Tomatoes</strong>
          <p>₹40/kg · 4.7 ★</p>
        </div>
      </div>
    </div>
  );
}

export default Hero;