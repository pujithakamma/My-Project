import { useState } from "react";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import Hero from "./Components/Hero/Hero";
import StatsCard from "./Components/StatsCard/StatsCard";
import ProductCard from "./Components/ProductCard/ProductCard";
import FeatureCard from "./Components/FeatureCard/FeatureCard";
import FarmCard from "./Components/FarmCard/FarmCard";
import Footer from "./Components/Footer/Footer";
import Login from "./Components/Login/Login";
import Registration from "./Components/Registration/Registration";
import Dashboard from "./Components/Dashboard/Dashboard";

function App() {
  const [activePage, setActivePage] = useState("home");
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

  const navigateHome = () => setActivePage("home");
  const navigateLogin = () => setActivePage("login");
  const navigateRegister = () => setActivePage("register");

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActivePage("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActivePage("home");
  };

  const handleRegister = (userData) => {
    setRegisteredUsers((prev) => [userData, ...prev]);
  };

  return (
    <>
      <Navbar
        onNavigateToHome={navigateHome}
        onNavigateToLogin={navigateLogin}
        onNavigateToRegistration={navigateRegister}
      />

      {activePage === "home" ? (
        <div className="container">
          <Sidebar />

          <div className="content">
            <Hero />

            <StatsCard title="Farmers" value="150+" />
            <StatsCard title="Customers" value="1200+" />
            <StatsCard title="Products" value="300+" />

            <ProductCard name="Tomato" price="₹40/kg" />
            <ProductCard name="Red Chilli" price="₹55/kg" />

            <FeatureCard title="Live Farm Camera" description="Watch your crops 24/7." />
            <FeatureCard title="Direct Purchase" description="Buy directly from farmers." />

            <FarmCard farmer="Ramesh" crop="Tomato" status="Growing" />
          </div>
        </div>
      ) : activePage === "login" ? (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegistration={navigateRegister}
          registeredUsers={registeredUsers}
        />
      ) : activePage === "register" ? (
        <Registration onRegister={handleRegister} onNavigateToLogin={navigateLogin} />
      ) : activePage === "dashboard" && isLoggedIn ? (
        <Dashboard
          user={currentUser}
          users={registeredUsers}
          onNavigateToHome={navigateHome}
          onLogout={handleLogout}
        />
      ) : (
        <div className="container">
          <Sidebar />
          <div className="content">
            <Hero />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default App;
