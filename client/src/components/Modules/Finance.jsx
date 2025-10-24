import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiCall } from '../../utils/api.js';
import { API_ENDPOINTS } from '../../config/constants.js';

const Finance = ({ user }) => {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const [invoicesResponse, paymentsResponse, expensesResponse] = await Promise.all([
        apiCall(API_ENDPOINTS.INVOICES),
        apiCall(API_ENDPOINTS.PAYMENTS),
        apiCall(API_ENDPOINTS.EXPENSES)
      ]);

      setInvoices(invoicesResponse.data || []);
      setPayments(paymentsResponse.data || []);
      setExpenses(expensesResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = invoices.filter(i => i.status === 'paid')
    .reduce((sum, invoice) => sum + (parseFloat(invoice.amount) || 0), 0);
  
  const pendingPayments = invoices.filter(i => i.status === 'pending')
    .reduce((sum, invoice) => sum + (parseFloat(invoice.amount) || 0), 0);
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
  
  const netProfit = totalRevenue - totalExpenses;

  const stats = [
    { 
      title: 'Total Revenue', 
      value: `₹${(totalRevenue / 100000).toFixed(1)}L`
    },
    { 
      title: 'Pending Payments', 
      value: `₹${(pendingPayments / 1000).toFixed(1)}K`
    },
    { 
      title: 'Total Expenses', 
      value: `₹${(totalExpenses / 1000).toFixed(1)}K`
    },
    { 
      title: 'Net Profit', 
      value: `₹${(netProfit / 1000).toFixed(1)}K`,
      color: netProfit >= 0 ? 'text-green-600' : 'text-red-600'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Finance & Accounts</h1>
          <p className="mt-2 text-gray-600">Track financial performance and transactions</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-orange-600 transition-colors"
          >
            Generate Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-gray-600 transition-colors"
          >
            Record Expense
          </motion.button>
        </div>
      </motion.div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <p className={`text-2xl font-bold mt-2 ${stat.color || 'text-gray-900'}`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoices */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
            <span className="text-sm text-gray-500">
              {invoices.length} invoices
            </span>
          </div>
          <div className="space-y-4">
            {invoices.slice(0, 5).map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">INV{invoice.id.toString().padStart(3, '0')}</p>
                  <p className="text-sm text-gray-500">{invoice.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{(invoice.amount || 0).toLocaleString()}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
            {invoices.length === 0 && (
              <p className="text-center text-gray-500 py-4">No invoices found</p>
            )}
          </div>
        </motion.div>

        {/* Recent Payments */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
            <span className="text-sm text-gray-500">
              {payments.length} payments
            </span>
          </div>
          <div className="space-y-4">
            {payments.slice(0, 5).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Payment #{payment.id}</p>
                  <p className="text-sm text-gray-500">{payment.customer_name}</p>
                  <p className="text-xs text-gray-400">{new Date(payment.payment_date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+₹{(payment.amount || 0).toLocaleString()}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
            {payments.length === 0 && (
              <p className="text-center text-gray-500 py-4">No payments found</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Type</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Description</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Vehicle</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.slice(0, 10).map((expense) => (
                <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 text-sm text-gray-600">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-sm text-gray-600 capitalize">{expense.expense_type}</td>
                  <td className="py-3 text-sm text-gray-600">{expense.expense_type} expense</td>
                  <td className="py-3 text-sm text-gray-600">{expense.vehicle_no || 'N/A'}</td>
                  <td className="py-3 text-sm font-medium text-red-600">-₹{(expense.amount || 0).toLocaleString()}</td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No expenses found
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

export default Finance;