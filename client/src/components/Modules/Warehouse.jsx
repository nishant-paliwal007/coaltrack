import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiCall } from '../../utils/api.js';
import { API_ENDPOINTS } from '../../config/constants.js';

const Warehouse = ({ user }) => {
  const [stock, setStock] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWarehouseData();
  }, []);

  const fetchWarehouseData = async () => {
    try {
      setLoading(true);
      const [stockResponse, warehousesResponse] = await Promise.all([
        apiCall(API_ENDPOINTS.STOCK),
        apiCall(API_ENDPOINTS.WAREHOUSES)
      ]);

      setStock(stockResponse.data || []);
      setWarehouses(warehousesResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch warehouse data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      title: 'Total Stock', 
      value: `${stock.reduce((sum, item) => sum + (parseFloat(item.quantity_available) || 0), 0).toFixed(0)} Tons`
    },
    { 
      title: 'Warehouses', 
      value: warehouses.length.toString()
    },
    { 
      title: 'Coal Grades', 
      value: [...new Set(stock.map(item => item.grade_name))].length.toString()
    }
  ];

  const getCapacityPercentage = (quantity, capacity) => {
    const percent = (quantity / capacity) * 100;
    return Math.min(percent, 100);
  };

  const getCapacityColor = (percentage) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Warehouse Management</h1>
          <p className="mt-2 text-gray-600">Monitor stock levels and warehouse operations</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-orange-600 transition-colors"
          >
            Add Stock
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-gray-600 transition-colors"
          >
            Stock Transfer
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Stock Levels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Current Stock Levels</h3>
          <span className="text-sm text-gray-500">
            {stock.length} stock entries
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">Warehouse</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Coal Grade</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Quantity</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Last Updated</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Capacity</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item) => {
                const capacityPercent = getCapacityPercentage(item.quantity_available, 1000); // Assuming 1000 tons capacity
                return (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 text-sm font-medium text-gray-900">{item.warehouse_name}</td>
                    <td className="py-3 text-sm text-gray-600">{item.grade_name}</td>
                    <td className="py-3 text-sm text-gray-600">{item.quantity_available} Tons</td>
                    <td className="py-3 text-sm text-gray-600">
                      {new Date(item.last_updated).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getCapacityColor(capacityPercent)}`}
                            style={{ width: `${capacityPercent}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{capacityPercent.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {stock.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No stock data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Warehouses List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Warehouses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {warehouses.map((warehouse) => (
            <div key={warehouse.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-900">{warehouse.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{warehouse.location}</p>
              <p className="text-sm text-gray-500 mt-2">Capacity: {warehouse.capacity} Tons</p>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: '65%' }}
                ></div>
              </div>
            </div>
          ))}
          {warehouses.length === 0 && (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No warehouses found
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Warehouse;