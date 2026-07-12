import { Link } from "react-router-dom";
import "./sidebar.css";

function Sidebar() {
    const items = [
        { label: "Home", to: "/overview" },
        { label: "Orders", to: "/orders" },
        { label: "Live Farms", to: "/live-farms" },
        { label: "Settings", to: "/settings" },
    ];

    return (
        <div className="sidebar">
            <h3>Dashboard</h3>
            {items.map((item) => (
                <Link key={item.to} to={item.to} className="sidebar-link">
                    {item.label}
                </Link>
            ))}
        </div>
    );
}

export default Sidebar;