import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { apiCall } from "../../utils/api.js";
import { API_ENDPOINTS } from "../../config/constants.js";

const Sales = ({ user }) => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders"); // 'orders' or 'customers'
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerFormData, setCustomerFormData] = useState({
    name: "",
    contact_person: "",
    phone: "",
    address: "",
    credit_limit: "",
    status: "active",
  });

  useEffect(() => {
    console.log("🔄 Active Tab:", activeTab);
    console.log("👥 Customers Data:", customers);
  }, [activeTab, customers]);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, customersResponse] = await Promise.all([
        apiCall(API_ENDPOINTS.SALES_ORDERS),
        apiCall(API_ENDPOINTS.CUSTOMERS),
      ]);

      setSalesOrders(ordersResponse.data || []);
      setCustomers(customersResponse.data || []);
    } catch (error) {
      console.error("Failed to fetch sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Customer CRUD Operations
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        // Update customer
        await apiCall(`${API_ENDPOINTS.CUSTOMERS}/${editingCustomer.id}`, {
          method: "PUT",
          body: customerFormData,
        });
      } else {
        // Create new customer
        await apiCall(API_ENDPOINTS.CUSTOMERS, {
          method: "POST",
          body: customerFormData,
        });
      }

      resetCustomerForm();
      fetchSalesData();
    } catch (error) {
      console.error("Failed to save customer:", error);
      alert(error.message);
    }
  };

  const resetCustomerForm = () => {
    setCustomerFormData({
      name: "",
      contact_person: "",
      phone: "",
      address: "",
      credit_limit: "",
      status: "active",
    });
    setEditingCustomer(null);
    setShowCustomerForm(false);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setCustomerFormData({
      name: customer.name,
      contact_person: customer.contact_person,
      phone: customer.phone,
      address: customer.address,
      credit_limit: customer.credit_limit,
      status: customer.status,
    });
    setShowCustomerForm(true);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await apiCall(`${API_ENDPOINTS.CUSTOMERS}/${customerId}`, {
          method: "DELETE",
        });
        fetchSalesData();
      } catch (error) {
        console.error("Failed to delete customer:", error);
        alert(error.message);
      }
    }
  };

  const stats = [
    {
      title: "Total Orders",
      value: salesOrders.length.toString(),
    },
    {
      title: "Pending Orders",
      value: salesOrders
        .filter((order) => order.status === "pending")
        .length.toString(),
    },
    {
      title: "Active Customers",
      value: customers.filter((c) => c.status === "active").length.toString(),
    },
    {
      title: "Total Revenue",
      value: `₹${(
        salesOrders.reduce(
          (sum, order) => sum + (parseFloat(order.total_amount) || 0),
          0
        ) / 100000
      ).toFixed(1)}L`,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "dispatched":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCustomerStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Sales & Customers
          </h1>
          <p className="mt-2 text-gray-600">
            Manage customer orders and customer relationships
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-orange-600 transition-colors"
          >
            Create Sales Order
          </motion.button>
        </div>
      </motion.div>

      {/* Sales Overview */}
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
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("orders")}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "orders"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Sales Orders
            </button>
            <button
              onClick={() => setActiveTab("customers")}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "customers"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Customer Management
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Sales Orders Tab */}
          {activeTab === "orders" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Sales Orders
                </h3>
                <span className="text-sm text-gray-500">
                  {salesOrders.length} orders
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Order ID
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Customer
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Quantity
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Amount
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Order Date
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Delivery Date
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 text-sm font-medium text-gray-900">
                          SO{order.id.toString().padStart(3, "0")}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {order.customer_name}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {order.total_quantity} Tons
                        </td>
                        <td className="py-3 text-sm font-medium text-gray-900">
                          ₹{(order.total_amount || 0).toLocaleString()}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {new Date(order.order_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {new Date(
                            order.required_delivery_date
                          ).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {salesOrders.length === 0 && (
                      <tr>
                        <td
                          colSpan="7"
                          className="py-4 text-center text-gray-500"
                        >
                          No sales orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Customer Management Tab */}
          {activeTab === "customers" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Customer Management
                </h3>
                <div className="flex space-x-3">
                  <span className="text-sm text-gray-500">
                    {customers.length} customers
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCustomerForm(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-green-600 transition-colors flex items-center"
                  >
                    <UserPlusIcon className="w-4 h-4 mr-2" />
                    Add Customer
                  </motion.button>
                </div>
              </div>

              {/* Customer Form Modal */}
              {showCustomerForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      {editingCustomer ? "Edit Customer" : "Add New Customer"}
                    </h2>

                    <form onSubmit={handleCustomerSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          required
                          value={customerFormData.name}
                          onChange={(e) =>
                            setCustomerFormData({
                              ...customerFormData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Person
                        </label>
                        <input
                          type="text"
                          required
                          value={customerFormData.contact_person}
                          onChange={(e) =>
                            setCustomerFormData({
                              ...customerFormData,
                              contact_person: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerFormData.phone}
                          onChange={(e) =>
                            setCustomerFormData({
                              ...customerFormData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <textarea
                          required
                          value={customerFormData.address}
                          onChange={(e) =>
                            setCustomerFormData({
                              ...customerFormData,
                              address: e.target.value,
                            })
                          }
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Credit Limit (₹)
                        </label>
                        <input
                          type="number"
                          value={customerFormData.credit_limit}
                          onChange={(e) =>
                            setCustomerFormData({
                              ...customerFormData,
                              credit_limit: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={customerFormData.status}
                          onChange={(e) =>
                            setCustomerFormData({
                              ...customerFormData,
                              status: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <button
                          type="submit"
                          className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                        >
                          {editingCustomer ? "Update" : "Create"} Customer
                        </button>
                        <button
                          type="button"
                          onClick={resetCustomerForm}
                          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}

              {/* Customers Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Company
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Contact Person
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Phone
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Credit Limit
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Status
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 text-sm font-medium text-gray-900">
                          {customer.name}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {customer.contact_person}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {customer.phone}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          ₹{(customer.credit_limit || 0).toLocaleString()}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getCustomerStatusColor(
                              customer.status
                            )}`}
                          >
                            {customer.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditCustomer(customer)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {customers.length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="py-4 text-center text-gray-500"
                        >
                          No customers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;
