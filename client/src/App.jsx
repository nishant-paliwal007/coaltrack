import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Auth/Login";
import Procurement from "./components/Modules/Procurement";
import Warehouse from "./components/Modules/Warehouse";
import Transportation from "./components/Modules/Transportation";
import Sales from "./components/Modules/Sales";
import Finance from "./components/Modules/Finance";
import UserManagement from "./components/Modules/UserManagement"; // ✅ ADD THIS IMPORT
import { apiCall } from "./utils/api.js";
import { API_ENDPOINTS } from "./config/constants.js";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentModule, setCurrentModule] = useState("dashboard");

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("coalERP_token");
      const storedUser = localStorage.getItem("coalERP_user");

      if (token && storedUser) {
        try {
          // Verify token with backend
          const response = await apiCall(API_ENDPOINTS.PROFILE);
          setUser(response.data);
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem("coalERP_token");
          localStorage.removeItem("coalERP_user");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await apiCall(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("coalERP_token");
      localStorage.removeItem("coalERP_user");
      setUser(null);
      setCurrentModule("dashboard");
    }
  };

  const renderModule = () => {
    switch (currentModule) {
      case "dashboard":
        return <Dashboard user={user} />;
      case "procurement":
        return <Procurement user={user} />;
      case "warehouse":
        return <Warehouse user={user} />;
      case "transport":
        return <Transportation user={user} />;
      case "sales":
        return <Sales user={user} />;
      case "finance":
        return <Finance user={user} />;
      case "users": // ✅ ADD THIS CASE
        return <UserManagement user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CoalERP...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Login onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Layout
              onLogout={handleLogout}
              user={user}
              currentModule={currentModule}
              setCurrentModule={setCurrentModule}
            >
              {renderModule()}
            </Layout>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
