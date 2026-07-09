import "./Dashboard.css";

function Dashboard({ studentName, onNavigateToHome }) {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Farm Connect Dashboard</h1>
          <p>Welcome back{studentName ? `, ${studentName}` : ""}. Review your farm activity, orders, and live updates.</p>
        </div>
        <button className="dashboard-home" onClick={onNavigateToHome}>
          Home
        </button>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <h2>Orders</h2>
          <p>10 new orders awaiting confirmation.</p>
        </section>

        <section className="dashboard-card">
          <h2>Farm Status</h2>
          <p>All fields are healthy. No alerts currently.</p>
        </section>

        <section className="dashboard-card">
          <h2>Recent Visitors</h2>
          <p>43 customers viewed your produce today.</p>
        </section>

        <section className="dashboard-card">
          <h2>Quick Actions</h2>
          <p>Update crop status, add new harvest, or manage orders.</p>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
