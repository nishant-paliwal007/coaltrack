import React from 'react';
import { motion } from 'framer-motion';

const Sales = ({ user }) => {
  const salesOrders = [
    { id: 'SO/2024/001', customer: 'Tata Power', amount: '₹12.5L', status: 'Delivered', date: '2024-01-18' },
    { id: 'SO/2024/002', customer: 'Adani Power', amount: '₹8.2L', status: 'In Transit', date: '2024-01-19' },
    { id: 'SO/2024/003', customer: 'JSW Steel', amount: '₹15.8L', status: 'Pending', date: '2024-01-20' }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales & Dispatch</h1>
          <p className="mt-2 text-gray-600">Manage customer orders and dispatches</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-orange-600 transition-colors mt-4 sm:mt-0"
        >
          Create Sales Order
        </motion.button>
      </motion.div>

      {/* Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'This Month Revenue', value: '₹45.2L', change: '+18%' },
          { title: 'Pending Orders', value: '12', change: '-3' },
          { title: 'Active Customers', value: '24', change: '+2' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
            <p className="text-sm text-green-600 mt-1">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Sales Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">Order ID</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {salesOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="py-3 text-sm text-gray-600">{order.customer}</td>
                  <td className="py-3 text-sm text-gray-600">{order.amount}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-600">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Sales;