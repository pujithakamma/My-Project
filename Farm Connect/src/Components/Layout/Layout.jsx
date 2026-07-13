import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/navbar";
import Footer from "../Footer/Footer";
import "./Layout.css";

function Layout({ isLoggedIn, onLogout }) {
  return (
    <div className="app-shell">
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <main className="layout-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
