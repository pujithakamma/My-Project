import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/navbar";
import Footer from "../Footer/Footer";
import "./Layout.css";

function Layout({ isLoggedIn, onLogout, pageLoading, theme, onThemeToggle }) {
  return (
    <div className="app-shell">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
        theme={theme}
        onThemeToggle={onThemeToggle}
      />
      {pageLoading && (
        <div className="page-transition-loading">
          <div className="spinner" />
          <span>Loading...</span>
        </div>
      )}
      <main className="layout-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
