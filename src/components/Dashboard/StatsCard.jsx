import React from "react";
import { motion } from "framer-motion";

const StatsCard = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <div
            className={`flex items-center mt-2 text-sm ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            <span>{change}</span>
            <span className="ml-1">{trend === "up" ? "↗" : "↘"}</span>
          </div>
        </div>
        <div
          className={`${color} w-12 h-12 rounded-lg flex items-center justify-center`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
