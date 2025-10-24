import React from "react";
import { motion } from "framer-motion";
import {
  HomeIcon,
  ShoppingCartIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  CogIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({
  onClose,
  onLogout,
  user,
  currentModule,
  setCurrentModule,
}) => {
  const menuItems = [
    { name: "Dashboard", icon: HomeIcon, module: "dashboard" },
    { name: "Procurement", icon: ShoppingCartIcon, module: "procurement" },
    { name: "Warehouse", icon: BuildingStorefrontIcon, module: "warehouse" },
    { name: "Transportation", icon: TruckIcon, module: "transport" },
    { name: "Sales", icon: CurrencyRupeeIcon, module: "sales" },
    { name: "Finance", icon: ChartBarIcon, module: "finance" },
    { name: "User Management", icon: UsersIcon, module: "users" },
    { name: "Settings", icon: CogIcon, module: "settings" },
  ];

  const handleModuleChange = (module) => {
    setCurrentModule(module);
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col grow bg-linear-to-b from-gray-800 to-gray-900 text-white">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <TruckIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">CoalERP</span>
        </motion.div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.name}
            onClick={() => handleModuleChange(item.module)}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              currentModule === item.module
                ? "bg-orange-500 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </motion.button>
        ))}
      </nav>

      {/* User Profile */}
      <motion.div
        className="p-4 border-t border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="font-semibold">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.role}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
