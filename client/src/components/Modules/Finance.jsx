import React from "react";
import { motion } from "framer-motion";

const Finance = ({ user }) => {
  const financialData = [
    { type: "Revenue", amount: "₹85.2L", change: "+12%", trend: "up" },
    { type: "Expenses", amount: "₹45.8L", change: "+8%", trend: "up" },
    { type: "Profit", amount: "₹39.4L", change: "+15%", trend: "up" },
    {
      type: "Pending Payments",
      amount: "₹12.3L",
      change: "-5%",
      trend: "down",
    },
  ];

  const recentTransactions = [
    {
      id: "INV001",
      description: "Payment from Tata Power",
      amount: "₹12.5L",
      date: "2024-01-18",
      type: "credit",
    },
    {
      id: "EXP001",
      description: "Fuel Expenses",
      amount: "₹2.3L",
      date: "2024-01-17",
      type: "debit",
    },
    {
      id: "INV002",
      description: "Payment from Adani Power",
      amount: "₹8.2L",
      date: "2024-01-16",
      type: "credit",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Finance & Accounts
          </h1>
          <p className="mt-2 text-gray-600">
            Track financial performance and transactions
          </p>
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
        {financialData.map((item, index) => (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <p className="text-sm font-medium text-gray-600">{item.type}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {item.amount}
            </p>
            <div
              className={`flex items-center mt-1 text-sm ${
                item.trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              <span>{item.change}</span>
              <span className="ml-1">{item.trend === "up" ? "↗" : "↘"}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Transactions
          </h3>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
                <div
                  className={`text-right ${
                    transaction.type === "credit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  <p className="font-semibold">
                    {transaction.type === "credit" ? "+" : "-"}
                    {transaction.amount}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {transaction.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Create Invoice", color: "bg-blue-100 text-blue-600" },
              { name: "View Ledger", color: "bg-green-100 text-green-600" },
              {
                name: "Expense Report",
                color: "bg-orange-100 text-orange-600",
              },
              { name: "Tax Summary", color: "bg-purple-100 text-purple-600" },
            ].map((action) => (
              <motion.button
                key={action.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${action.color} p-4 rounded-lg text-center font-medium hover:shadow-md transition-shadow`}
              >
                {action.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Finance;
