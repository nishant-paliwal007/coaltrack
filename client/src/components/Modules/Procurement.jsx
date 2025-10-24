import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiCall } from '../../utils/api.js';
import { API_ENDPOINTS } from '../../config/constants.js';

const Procurement = ({ user }) => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProcurementData();
  }, []);

  const fetchProcurementData = async () => {
    try {
      setLoading(true);
      const [poResponse, suppliersResponse] = await Promise.all([
        apiCall(API_ENDPOINTS.PURCHASE_ORDERS),
        apiCall(API_ENDPOINTS.SUPPLIERS)
      ]);

      setPurchaseOrders(poResponse.data || []);
      setSuppliers(suppliersResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch procurement data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      title: 'Total POs', 
      value: purchaseOrders.length.toString()
    },
    { 
      title: 'Pending Delivery', 
      value: purchaseOrders.filter(po => po.status === 'pending').length.toString()
    },
    { 
      title: 'Active Suppliers', 
      value: suppliers.filter(s => s.status === 'active').length.toString()
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

      {/* Purchase Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Purchase Orders</h3>
          <span className="text-sm text-gray-500">
            Total: {purchaseOrders.length} orders
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">PO Number</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Supplier</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Quantity</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Order Date</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium text-gray-900">{po.po_number}</td>
                  <td className="py-3 text-sm text-gray-600">
                    {po.supplier_name || 'N/A'}
                  </td>
                  <td className="py-3 text-sm text-gray-600">{po.total_quantity} Tons</td>
                  <td className="py-3 text-sm text-gray-600">
                    {new Date(po.order_date).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(po.status)}`}>
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
              {purchaseOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No purchase orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Suppliers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Suppliers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">Name</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Contact</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Phone</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Grade Offered</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium text-gray-900">{supplier.name}</td>
                  <td className="py-3 text-sm text-gray-600">{supplier.contact_person}</td>
                  <td className="py-3 text-sm text-gray-600">{supplier.phone}</td>
                  <td className="py-3 text-sm text-gray-600">{supplier.grade_offered}</td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">
                    No suppliers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Procurement;