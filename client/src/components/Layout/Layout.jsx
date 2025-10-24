import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({
  children,
  onLogout,
  user,
  currentModule,
  setCurrentModule,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:flex lg:shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar
            onLogout={onLogout}
            user={user}
            currentModule={currentModule}
            setCurrentModule={setCurrentModule}
          />
        </div>
      </div>

      {/* Sidebar for Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              <Sidebar
                onClose={() => setSidebarOpen(false)}
                onLogout={onLogout}
                user={user}
                currentModule={currentModule}
                setCurrentModule={setCurrentModule}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          onLogout={onLogout}
          currentModule={currentModule}
        />
        <main className="flex-1 overflow-auto p-4 bg-gray-50">
          <motion.div
            key={currentModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
