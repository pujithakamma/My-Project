import { Link } from "react-router-dom";
import "./pages.css";

const products = [
  { id: 1, name: "Fresh Tomatoes", price: "₹40/kg", origin: "Penamakuru" },
  { id: 2, name: "Red Chilli", price: "₹55/kg", origin: "Prathipadu" },
  { id: 3, name: "Organic Rice", price: "₹65/kg", origin: "Guntur" },
];

function ProductsPage() {
  return (
    <div className="page-shell">
      <div className="page-card">
        <h1>Products</h1>
        <p>Pick a product to view more details.</p>
        <div className="products-grid">
          {products.map((product) => (
            <article key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <p>Origin: {product.origin}</p>
              <Link to={`/products/${product.id}`} className="page-btn" style={{ display: "inline-block", marginTop: 10 }}>
                View Details
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
