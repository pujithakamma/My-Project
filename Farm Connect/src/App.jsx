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
import UserDetailsPage from "./pages/UserDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const getStoredAuthState = () => {
    if (typeof window === "undefined") return { isLoggedIn: false, currentUser: null };

    try {
      const savedUser = window.localStorage.getItem("user");
      if (!savedUser) return { isLoggedIn: false, currentUser: null };

      const parsedUser = JSON.parse(savedUser);
      return { isLoggedIn: true, currentUser: parsedUser };
    } catch (error) {
      console.error("Unable to read saved auth state:", error);
      return { isLoggedIn: false, currentUser: null };
    }
  };

  const getStoredUsers = () => {
    if (typeof window === "undefined") return [];

    try {
      const savedUsers = window.localStorage.getItem("farmConnectUsers");
      if (!savedUsers) return [];
      return JSON.parse(savedUsers);
    } catch (error) {
      console.error("Unable to read saved users:", error);
      return [];
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(() => getStoredAuthState().isLoggedIn);
  const [currentUser, setCurrentUser] = useState(() => getStoredAuthState().currentUser);
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const defaultUsers = [
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
    ];

    const storedUsers = getStoredUsers();
    return storedUsers.length > 0 ? storedUsers : defaultUsers;
  });

  const location = useLocation();
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    setPageLoading(true);
    const timer = window.setTimeout(() => setPageLoading(false), 2000);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isLoggedIn && currentUser) {
        window.localStorage.setItem("user", JSON.stringify(currentUser));
      }
      window.localStorage.setItem("farmConnectUsers", JSON.stringify(registeredUsers));
    }
  }, [isLoggedIn, currentUser, registeredUsers]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("user", JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("user");
    }
  };

  const handleRegister = (userData) => {
    setRegisteredUsers((prev) => [userData, ...prev]);
  };

  return (
    <Routes>
      <Route path="/" element={<Layout isLoggedIn={isLoggedIn} onLogout={handleLogout} pageLoading={pageLoading} />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="details/:id" element={<ProductDetailsPage />} />
        <Route path="users" element={<UserDetailsPage registeredUsers={registeredUsers} />} />
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
