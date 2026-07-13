import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TomatoesImage from "../assets/Products/Tomatoes.jpg";
import RedChilliImage from "../assets/Products/Red chilli.webp";
import OrganicRiceImage from "../assets/Products/Organic-Rice.jpg";
import FreshCarrotsImage from "../assets/Products/Freshcarrots.jpeg";
import GroundnutSeedsImage from "../assets/Products/Groundnut.webp";
import "./pages.css";

const PRODUCTS_CACHE_KEY = "farmConnectProducts";
const FAVORITES_KEY = "farmConnectFavorites";
const RECENTLY_VIEWED_KEY = "farmConnectRecentProducts";
const ORDERS_KEY = "farmConnectOrders";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderMessage, setOrderMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const hasLoadedOrders = useRef(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    try {
      const cachedProducts = localStorage.getItem(PRODUCTS_CACHE_KEY);
      const cachedFavorites = localStorage.getItem(FAVORITES_KEY);
      const cachedRecent = localStorage.getItem(RECENTLY_VIEWED_KEY);
      const cachedOrders = localStorage.getItem(ORDERS_KEY);

      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts));
      }

      if (cachedFavorites) {
        setFavorites(JSON.parse(cachedFavorites));
      }

      if (cachedRecent) {
        setRecentlyViewed(JSON.parse(cachedRecent));
      }

      if (cachedOrders) {
        setOrders(JSON.parse(cachedOrders));
      }
    } catch (storageError) {
      console.error("Unable to read saved products or orders:", storageError);
    }
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const farmProducts = [
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

      setProducts(farmProducts);
      localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(farmProducts));
    } catch (fetchError) {
      setError("We could not load the farm products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (!hasLoadedOrders.current) {
      hasLoadedOrders.current = true;
      return;
    }

    try {
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (storageError) {
      console.error("Unable to save orders:", storageError);
    }
  }, [orders]);

  const favoriteProducts = useMemo(
    () => products.filter((product) => favorites.includes(product.id)),
    [favorites, products]
  );

  const recentProducts = useMemo(
    () => products.filter((product) => recentlyViewed.includes(product.id)),
    [products, recentlyViewed]
  );

  const categories = useMemo(() => ["all", ...new Set(products.map((product) => product.category))], [products]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term);
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price") return Number(a.price.replace(/[^0-9]/g, "")) - Number(b.price.replace(/[^0-9]/g, ""));
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return a.id - b.id;
    });

    return result;
  }, [categoryFilter, products, searchTerm, sortBy]);

  const toggleFavorite = (productId) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  };

  const getCurrentUser = () => {
    try {
      const userData = window.localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  const createOrder = (product, quantity = 1) => {
    const nextOrderId = orders.length > 0 ? Math.max(...orders.map((order) => order.id)) + 1 : 201;
    const unitPrice = Number(product.price.replace(/[^0-9]/g, "")) || 0;
    const total = `₹${unitPrice * quantity}`;
    const currentUser = getCurrentUser();
    const customerName = currentUser?.fullName || currentUser?.username || "Guest Customer";

    const newOrder = {
      id: nextOrderId,
      customer: customerName,
      product: product.name,
      quantity,
      total,
      status: "Pending",
      orderedOn: new Date().toISOString().slice(0, 10),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setOrderMessage(`Order placed for ${customerName}: ${product.name} (${quantity})`);
    window.setTimeout(() => setOrderMessage(""), 3500);
  };

  return (
    <div className="page-shell">
      <div className="page-card">
        <div className="page-heading-row">
          <div>
            <h1>Fresh Picks</h1>
            <p>Browse farm-friendly products and open their full details page.</p>
          </div>
          <span className="highlight-pill">Saved locally</span>
        </div>

        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search products by name or category"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <select className="filter-select" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All categories" : category}
              </option>
            ))}
          </select>
          <select className="filter-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="name">Sort by name</option>
            <option value="price">Sort by price</option>
            <option value="category">Sort by category</option>
            <option value="id">Default order</option>
          </select>
          <button type="button" className="page-btn secondary" onClick={() => fetchProducts()}>
            Refresh data
          </button>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading fresh products...</p>
          </div>
        )}

        {!loading && error && <div className="error-banner">{error}</div>}
        {orderMessage && <div className="error-banner" style={{ background: "#e6f4ea", color: "#1f5b25", borderColor: "#b8dec0" }}>{orderMessage}</div>}

        {favoriteProducts.length > 0 && (
          <div className="bonus-section">
            <h2>Favorite Products</h2>
            <div className="chip-row">
              {favoriteProducts.map((product) => (
                <span key={product.id} className="chip">
                  {product.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {recentProducts.length > 0 && (
          <div className="bonus-section">
            <h2>Recently Viewed</h2>
            <div className="chip-row">
              {recentProducts.map((product) => (
                <Link key={product.id} to={`/details/${product.id}`} className="chip chip-link">
                  {product.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="products-grid">
          {filteredProducts.map((product) => {
            const isFavorite = favorites.includes(product.id);

            return (
              <article key={product.id} className="product-card">
                <Link to={`/details/${product.id}`} className="product-image-link">
                  <img src={product.image} alt={product.name} className="product-image" />
                </Link>
                <div className="product-content">
                  <p className="product-category">{product.category}</p>
                  <h3>{product.name}</h3>
                  <p className="product-price">{product.price}</p>
                  <p className="product-description">{product.description.slice(0, 90)}...</p>
                </div>
                <div className="route-actions">
                  <button type="button" className="page-btn secondary" onClick={() => toggleFavorite(product.id)}>
                    {isFavorite ? "★ Saved" : "☆ Save"}
                  </button>
                  <button type="button" className="page-btn secondary" onClick={() => createOrder(product, 1)}>
                    Order
                  </button>
                  <Link to={`/details/${product.id}`} className="page-btn">
                    View
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
