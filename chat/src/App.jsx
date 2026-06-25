import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import User from "./pages/User";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

// existing imports...

export default function App() {
  const activeTab = useSelector((state) => state.navigation?.activeTab);
  const darkMode = useSelector((state) => state.navigation?.darkMode);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });

  // Sync theme changes to Tailwind dark class on html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Redux-based routing resolver
  const renderActivePage = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "analytics":
        return <Analytics />;
      case "products":
        return <Products />;
      case "orders":
        return <Orders />;
      case "users":
        return <User />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }
  return <DashboardLayout>{renderActivePage()}</DashboardLayout>;
}
