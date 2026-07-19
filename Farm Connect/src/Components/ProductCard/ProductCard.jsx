import "./ProductCard.css";
import { Link } from "react-router-dom";

function ProductCard({ product = {} }) {
  return (
    <article className="product-card">
      <Link to={`/details/${product.id}`}>
        <img src={product.image} alt={product.name} className="product-image" />
      </Link>

      <div className="product-content">
        <p className="product-category">{product.category}</p>
        <h3>{product.name || "Fresh Product"}</h3>
        <p className="product-price">{product.price ?? "₹0"}</p>
        <p>Farmer: {product.farmerName}</p>
        <p>Quantity: {product.quantity}</p>
        <p>Location: {product.location}</p>
        <p className="product-description">{product.description}</p>
        <div className="route-actions">
          <Link to={`/details/${product.id}`} className="page-btn">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;