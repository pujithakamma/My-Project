import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Layout from "./Components/Layout/Layout";
import Login from "./Components/Login/Login";
import Registration from "./Components/Registration/Registration";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardOverview from "./pages/DashboardOverview";
import DashboardProfile from "./pages/DashboardProfile";
import DashboardSettings from "./pages/DashboardSettings";
import DashboardOrders from "./pages/DashboardOrders";
import DashboardLiveFarms from "./pages/DashboardLiveFarms";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([
    {
      id: 1,
      fullName: "Ramesh Kumar",
      email: "ramesh@example.com",
      username: "rameshkumar",
      password: "ramesh@123",
      mobile: "9876543210",
      userType: "Farmer",
      village: "Penamakuru",
      farmName: "Green Valley Farm",
      crops: "Tomato, Chillies",
      address: "12, Main Road",
      state: "Andhra Pradesh",
      pincode: "600001",
    },
    {
      id: 2,
      fullName: "Meera Nair",
      email: "meeranair@example.com",
      username: "meeranair",
      password: "meeranair@123",
      mobile: "8123456789",
      userType: "Customer",
      village: "Pratthipadu",
      farmName: "natures farm",
      crops: "potatoes, carrots",
      address: "3, Market Street",
      state: "Andhra Pradesh",
      pincode: "600002",
    },
  ]);

  const location = useLocation();

  const pageTitle = useMemo(() => {
    const titles = {
      "/": "Farm Connect | Home",
      "/about": "Farm Connect | About",
      "/products": "Farm Connect | Products",
      "/login": "Farm Connect | Login",
      "/register": "Farm Connect | Register",
      "/dashboard": "Farm Connect | Dashboard",
    };

    return titles[location.pathname] || "Farm Connect | Page Not Found";
  }, [location.pathname]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const handleRegister = (userData) => {
    setRegisteredUsers((prev) => [userData, ...prev]);
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="overview" element={<DashboardOverview />} />
        <Route path="orders" element={<DashboardOrders />} />
        <Route path="live-farms" element={<DashboardLiveFarms />} />
        <Route path="settings" element={<DashboardSettings />} />
        <Route
          path="login"
          element={isLoggedIn ? <Navigate to="/dashboard/overview" replace /> : (
            <Login onLoginSuccess={handleLoginSuccess} registeredUsers={registeredUsers} />
          )}
        />
        <Route path="register" element={<Registration onRegister={handleRegister} />} />
        <Route
          path="dashboard"
          element={<DashboardPage user={currentUser} isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<DashboardOverview />} />
          <Route path="profile" element={<DashboardProfile user={currentUser} />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="live-farms" element={<DashboardLiveFarms />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
