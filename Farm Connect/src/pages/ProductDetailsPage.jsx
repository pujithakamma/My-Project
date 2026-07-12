import { Link, useParams } from "react-router-dom";
import "./pages.css";

const products = [
  { id: 1, name: "Fresh Tomatoes", price: "₹40/kg", origin: "Penamakuru", description: "Locally harvested tomatoes with rich color and flavor." },
  { id: 2, name: "Red Chilli", price: "₹55/kg", origin: "Prathipadu", description: "Premium dried chilli sourced from trusted farmers." },
  { id: 3, name: "Organic Rice", price: "₹65/kg", origin: "Guntur", description: "Naturally grown rice with excellent grain quality." },
];

function ProductDetailsPage() {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <div className="page-shell">
        <div className="page-card">
          <h1>Product Not Found</h1>
          <p>The requested product does not exist.</p>
          <Link to="/products" className="page-btn">Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-card">
        <h1>{product.name}</h1>
        <p><strong>Price:</strong> {product.price}</p>
        <p><strong>Origin:</strong> {product.origin}</p>
        <p>{product.description}</p>
        <div className="route-actions">
          <Link to="/products" className="page-btn">Back to Products</Link>
          <Link to="/dashboard" className="page-btn secondary">Open Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
