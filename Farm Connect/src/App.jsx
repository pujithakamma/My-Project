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

function App() {
  const [activePage, setActivePage] = useState("home");

  const navigateHome = () => setActivePage("home");
  const navigateLogin = () => setActivePage("login");
  const navigateRegister = () => setActivePage("register");

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

            <ProductCard name="Tomato" price="?40/kg" />
            <ProductCard name="Red Chilli" price="?55/kg" />

            <FeatureCard title="Live Farm Camera" description="Watch your crops 24/7." />
            <FeatureCard title="Direct Purchase" description="Buy directly from farmers." />

            <FarmCard farmer="Ramesh" crop="Tomato" status="Growing" />
          </div>
        </div>
      ) : activePage === "login" ? (
        <Login onLoginSuccess={navigateHome} />
      ) : (
        <Registration />
      )}

      <Footer />
    </>
  );
}

export default App;
