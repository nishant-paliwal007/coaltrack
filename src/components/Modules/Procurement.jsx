import React from 'react';
import { motion } from 'framer-motion';

const Procurement = ({ user }) => {
  const purchaseOrders = [
    { id: 'PO/2024/001', supplier: 'Coal India Ltd', quantity: '100 Tons', status: 'Confirmed', date: '2024-01-15' },
    { id: 'PO/2024/002', supplier: 'Singareni Collieries', quantity: '75 Tons', status: 'Pending', date: '2024-01-16' },
    { id: 'PO/2024/003', supplier: 'NTPC Coal Mines', quantity: '150 Tons', status: 'Delivered', date: '2024-01-10' }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Procurement Management</h1>
          <p className="mt-2 text-gray-600">Manage coal purchases and supplier relationships</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-orange-600 transition-colors mt-4 sm:mt-0"
        >
          Create Purchase Order
        </motion.button>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total POs', value: '24', change: '+5' },
          { title: 'Pending Delivery', value: '8', change: '-2' },
          { title: 'This Month Spend', value: '₹85.2L', change: '+12%' }
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

      {/* Recent Purchase Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Purchase Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">PO Number</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Supplier</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Quantity</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium text-gray-900">{po.id}</td>
                  <td className="py-3 text-sm text-gray-600">{po.supplier}</td>
                  <td className="py-3 text-sm text-gray-600">{po.quantity}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      po.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      po.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-600">{po.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Procurement;