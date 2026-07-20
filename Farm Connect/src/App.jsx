import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
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
import UserEditPage from "./pages/UserEditPage";
import UserViewPage from "./pages/UserViewPage";
import NotFoundPage from "./pages/NotFoundPage";

const THEME_STORAGE_KEY = "farmConnectTheme";
const LAST_PAGE_STORAGE_KEY = "farmConnectLastPage";

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

  const getStoredTheme = () => {
    if (typeof window === "undefined") return "light";

    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY) || "light";
    } catch (error) {
      console.error("Unable to read saved theme:", error);
      return "light";
    }
  };

  const getStoredLastPage = () => {
    if (typeof window === "undefined") return "/products";

    try {
      return window.sessionStorage.getItem(LAST_PAGE_STORAGE_KEY) || "/products";
    } catch (error) {
      console.error("Unable to read session page:", error);
      return "/products";
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
  const [theme, setTheme] = useState(() => getStoredTheme());
  const [lastVisitedPage, setLastVisitedPage] = useState(() => getStoredLastPage());

  const location = useLocation();
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    setPageLoading(true);
    const timer = window.setTimeout(() => setPageLoading(false), 1200);
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
      document.documentElement.setAttribute("data-theme", theme);
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isLoggedIn && currentUser) {
        window.localStorage.setItem("user", JSON.stringify(currentUser));
      }
      window.localStorage.setItem("farmConnectUsers", JSON.stringify(registeredUsers));
      window.sessionStorage.setItem(LAST_PAGE_STORAGE_KEY, location.pathname);
      setLastVisitedPage(location.pathname);
    }
  }, [isLoggedIn, currentUser, registeredUsers, location.pathname]);

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
    navigate("/login", { replace: true });
  };

  const handleRegister = (userData) => {
    setRegisteredUsers((prev) => [userData, ...prev]);
  };

  const handleDeleteUser = (userId) => {
    setRegisteredUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleUpdateUser = (userId, updates) => {
    setRegisteredUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, ...updates } : user))
    );
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            pageLoading={pageLoading}
            theme={theme}
            onThemeToggle={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
          />
        }
      >
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="products" element={<ProductsPage lastVisitedPage={lastVisitedPage} />} />
        <Route path="details/:id" element={<ProductDetailsPage />} />
        <Route path="users" element={<UserDetailsPage />} />
        <Route path="users/view/:id" element={<UserViewPage registeredUsers={registeredUsers} />} />
        <Route path="users/edit/:id" element={<UserEditPage registeredUsers={registeredUsers} onUpdateUser={handleUpdateUser} />} />
        <Route path="overview" element={<DashboardOverview />} />
        <Route path="orders" element={<DashboardOrders />} />
        <Route path="live-farms" element={<DashboardLiveFarms />} />
        <Route path="settings" element={<DashboardSettings />} />
        <Route
          path="login"
          element={
            isLoggedIn ? <Navigate to="/dashboard/overview" replace /> : (
              <Login onLoginSuccess={handleLoginSuccess} registeredUsers={registeredUsers} />
            )
          }
        />
        <Route path="register" element={<Registration registeredUsers={registeredUsers} onRegister={handleRegister} />} />
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
