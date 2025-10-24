import React from 'react';
import { motion } from 'framer-motion';

const Warehouse = ({ user }) => {
  const stockData = [
    { warehouse: 'Mumbai', grade: 'Grade A', quantity: '250 Tons', capacity: '80%' },
    { warehouse: 'Delhi', grade: 'Grade B', quantity: '180 Tons', capacity: '60%' },
    { warehouse: 'Chennai', grade: 'Grade C', quantity: '120 Tons', capacity: '40%' }
  ];

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

      {/* Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Stock', value: '1,250 Tons', color: 'bg-blue-500' },
          { title: 'Warehouses', value: '3', color: 'bg-green-500' },
          { title: 'Low Stock Alerts', value: '2', color: 'bg-red-500' },
          { title: 'Today Inward', value: '85 Tons', color: 'bg-purple-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                <span className="text-lg font-bold">{stat.value.split(' ')[0]}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stock Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Stock Levels</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">Warehouse</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Coal Grade</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Quantity</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Capacity</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((stock, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium text-gray-900">{stock.warehouse}</td>
                  <td className="py-3 text-sm text-gray-600">{stock.grade}</td>
                  <td className="py-3 text-sm text-gray-600">{stock.quantity}</td>
                  <td className="py-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          stock.capacity === '80%' ? 'bg-red-500' :
                          stock.capacity === '60%' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: stock.capacity }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{stock.capacity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Warehouse;