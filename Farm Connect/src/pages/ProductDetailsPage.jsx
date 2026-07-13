import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TomatoesImage from "../assets/Products/Tomatoes.jpg";
import RedChilliImage from "../assets/Products/Red chilli.webp";
import OrganicRiceImage from "../assets/Products/Organic-Rice.jpg";
import FreshCarrotsImage from "../assets/Products/Freshcarrots.jpeg";
import GroundnutSeedsImage from "../assets/Products/Groundnut.webp";
import "./pages.css";

const PRODUCTS_CACHE_KEY = "farmConnectProducts";
const RECENTLY_VIEWED_KEY = "farmConnectRecentProducts";
const ORDERS_KEY = "farmConnectOrders";

const fallbackProducts = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    price: "₹40/kg",
    category: "Vegetables",
    description: "Juicy, locally harvested tomatoes delivered fresh from Green Valley Farm.",
    image: TomatoesImage,
    rating: 4.7,
  },
  {
    id: 2,
    name: "Red Chilli",
    price: "₹55/kg",
    category: "Spices",
    description: "Premium red chilli sourced from trusted farmers in Prathipadu.",
    image: RedChilliImage,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Organic Rice",
    price: "₹65/kg",
    category: "Grains",
    description: "Naturally grown organic rice with excellent grain quality.",
    image: OrganicRiceImage,
    rating: 4.8,
  },
  {
    id: 4,
    name: "Fresh Carrots",
    price: "₹30/kg",
    category: "Vegetables",
    description: "Sweet and crunchy carrots harvested at peak freshness.",
    image: FreshCarrotsImage,
    rating: 4.3,
  },
  {
    id: 5,
    name: "Groundnut Seeds",
    price: "₹90/kg",
    category: "Seeds",
    description: "High-yield groundnut seeds suitable for local farming needs.",
    image: GroundnutSeedsImage,
    rating: 4.6,
  },
];

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderMessage, setOrderMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hasLoadedOrders = useRef(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        let cachedProducts = [];
        try {
          cachedProducts = JSON.parse(localStorage.getItem(PRODUCTS_CACHE_KEY) || "[]");
        } catch (storageError) {
          console.error("Unable to access cached products:", storageError);
        }

        const availableProducts = cachedProducts.length > 0 ? cachedProducts : fallbackProducts;
        const matchedProduct = availableProducts.find((item) => item.id === Number(id));

        if (matchedProduct) {
          setProduct(matchedProduct);
        } else {
          setError("This product could not be loaded right now. Please try again later.");
        }
      } catch (fetchError) {
        setError("This product could not be loaded right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.id) {
      try {
        const recentItems = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");
        const updatedRecent = [product.id, ...recentItems.filter((item) => item !== product.id)].slice(0, 5);
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updatedRecent));
      } catch (storageError) {
        console.error("Unable to save recent items:", storageError);
      }
    }
  }, [product?.id]);

  useEffect(() => {
    try {
      const cachedOrders = localStorage.getItem(ORDERS_KEY);
      setOrders(cachedOrders ? JSON.parse(cachedOrders) : []);
    } catch (storageError) {
      console.error("Unable to read saved orders:", storageError);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedOrders.current) {
      hasLoadedOrders.current = true;
      return;
    }

    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (storageError) {
      console.error("Unable to save orders:", storageError);
    }
  }, [orders]);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-card">
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-shell">
        <div className="page-card">
          <h1>Product Not Found</h1>
          <p>The requested product does not exist or could not be loaded.</p>
          <div className="route-actions">
            <Link to="/products" className="page-btn">Back to Products</Link>
            <Link to="/" className="page-btn secondary">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const getCurrentUser = () => {
    try {
      const userData = window.localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  const createOrder = (product, quantity = 1) => {
    const nextId = orders.length > 0 ? Math.max(...orders.map((order) => order.id)) + 1 : 201;
    const unitPrice = Number(product.price.replace(/[^0-9]/g, "")) || 0;
    const total = `₹${unitPrice * quantity}`;
    const currentUser = getCurrentUser();
    const customerName = currentUser?.fullName || currentUser?.username || "Guest Customer";

    const newOrder = {
      id: nextId,
      customer: customerName,
      product: product.name,
      quantity,
      total,
      status: "Pending",
      orderedOn: new Date().toISOString().slice(0, 10),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setOrderMessage(`Order placed for ${customerName}: ${product.name}`);
    window.setTimeout(() => setOrderMessage(""), 3500);
  };

  return (
    <div className="page-shell">
      <div className="page-card detail-card">
        <img src={product.image} alt={product.name} className="detail-image" />
        <div className="detail-info">
          <p className="product-category">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="detail-price">{product.price}</p>
          <p>{product.description}</p>
          <div className="detail-stats">
            <span>Rating: {product.rating.toFixed(1)} / 5</span>
            <span>Saved in local storage</span>
          </div>
          {orderMessage && (
            <div className="error-banner" style={{ background: "#e6f4ea", color: "#1f5b25", borderColor: "#b8dec0" }}>
              {orderMessage}
            </div>
          )}
          {error && <div className="error-banner">{error}</div>}
          <div className="route-actions">
            <button type="button" className="page-btn secondary" onClick={() => createOrder(product, 1)}>
              Order Now
            </button>
            <Link to="/products" className="page-btn">Back to Products</Link>
            <Link to="/dashboard" className="page-btn secondary">Open Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
