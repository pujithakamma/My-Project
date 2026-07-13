import { useEffect, useMemo, useRef, useState } from "react";
import "./pages.css";

const ORDERS_KEY = "farmConnectOrders";

const sampleOrders = [
  {
    id: 101,
    customer: "Anjali Sharma",
    product: "Fresh Tomatoes",
    quantity: 3,
    total: "₹120",
    status: "Pending",
    orderedOn: "2026-07-10",
  },
  {
    id: 102,
    customer: "Ravi Patel",
    product: "Organic Rice",
    quantity: 2,
    total: "₹130",
    status: "Shipped",
    orderedOn: "2026-07-09",
  },
  {
    id: 103,
    customer: "Meera Das",
    product: "Red Chilli",
    quantity: 1,
    total: "₹55",
    status: "Delivered",
    orderedOn: "2026-07-06",
  },
  {
    id: 104,
    customer: "Amit Jain",
    product: "Fresh Carrots",
    quantity: 4,
    total: "₹120",
    status: "Cancelled",
    orderedOn: "2026-07-08",
  },
];

function DashboardOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const hasLoadedOrders = useRef(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(ORDERS_KEY);
      setOrders(stored ? JSON.parse(stored) : sampleOrders);
    } catch (error) {
      console.error("Failed to load orders", error);
      setOrders(sampleOrders);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedOrders.current) {
      hasLoadedOrders.current = true;
      return;
    }

    try {
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("Failed to save orders", error);
    }
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter = statusFilter === "all" || order.status === statusFilter;
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        order.customer.toLowerCase().includes(term) ||
        order.product.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term);
      return matchesFilter && matchesSearch;
    });
  }, [orders, searchTerm, statusFilter]);

  const counts = useMemo(
    () => ({
      all: orders.length,
      Pending: orders.filter((order) => order.status === "Pending").length,
      Shipped: orders.filter((order) => order.status === "Shipped").length,
      Delivered: orders.filter((order) => order.status === "Delivered").length,
      Cancelled: orders.filter((order) => order.status === "Cancelled").length,
    }),
    [orders]
  );

  const updateStatus = (id, status) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)));
  };

  return (
    <div className="page-card">
      <div className="page-heading-row">
        <div>
          <h2>Orders</h2>
          <p>Track orders, update shipment status, and review purchase history.</p>
        </div>
        <span className="highlight-pill">{counts.all} orders</span>
      </div>

      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by customer, product, or status"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <select className="filter-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Pending</h3>
          <p>{counts.Pending}</p>
        </div>
        <div className="stat-card">
          <h3>Shipped</h3>
          <p>{counts.Shipped}</p>
        </div>
        <div className="stat-card">
          <h3>Delivered</h3>
          <p>{counts.Delivered}</p>
        </div>
        <div className="stat-card">
          <h3>Cancelled</h3>
          <p>{counts.Cancelled}</p>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">No orders match your current search or filter.</div>
      ) : (
        <div className="table-wrapper">
          <h2>Recent Orders</h2>
          <table className="records-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Status</th>
                <th>Ordered On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>
                  <td>{order.quantity}</td>
                  <td>{order.total}</td>
                  <td>{order.status}</td>
                  <td>{order.orderedOn}</td>
                  <td>
                    {order.status === "Pending" && (
                      <button className="page-btn secondary" type="button" onClick={() => updateStatus(order.id, "Shipped")}>Shipped</button>
                    )}
                    {order.status === "Shipped" && (
                      <button className="page-btn secondary" type="button" onClick={() => updateStatus(order.id, "Delivered")}>Delivered</button>
                    )}
                    {order.status === "Delivered" && <span style={{ color: "#2e7d32", fontWeight: 700 }}>Done</span>}
                    {order.status === "Cancelled" && <span style={{ color: "#9c2c00", fontWeight: 700 }}>Cancelled</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashboardOrders;
