import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatsCard from "./StatsCard";
import RecentActivity from "./RecentActivity";
import { apiCall } from "../../utils/api.js";
import { API_ENDPOINTS } from "../../config/constants.js";
import {
  ShoppingCartIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  CurrencyRupeeIcon,
  ArrowPathIcon,
  EyeIcon,
  ChartBarIcon,
  MapPinIcon,
  WrenchIcon,
  UsersIcon,
  BanknotesIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Role-based quick actions function
  const getQuickActions = (role) => {
    const actions = {
      Admin: [
        {
          name: "Create PO",
          icon: ShoppingCartIcon,
          color: "bg-blue-100 text-blue-600",
          module: "procurement",
        },
        {
          name: "Add Stock",
          icon: BuildingStorefrontIcon,
          color: "bg-green-100 text-green-600",
          module: "warehouse",
        },
        {
          name: "Schedule Trip",
          icon: TruckIcon,
          color: "bg-orange-100 text-orange-600",
          module: "transport",
        },
        {
          name: "Generate Invoice",
          icon: CurrencyRupeeIcon,
          color: "bg-purple-100 text-purple-600",
          module: "finance",
        },
      ],
      "Warehouse Manager": [
        {
          name: "Add Stock",
          icon: BuildingStorefrontIcon,
          color: "bg-green-100 text-green-600",
          module: "warehouse",
        },
        {
          name: "Stock Transfer",
          icon: ArrowPathIcon,
          color: "bg-blue-100 text-blue-600",
          module: "warehouse",
        },
        {
          name: "View Inventory",
          icon: EyeIcon,
          color: "bg-orange-100 text-orange-600",
          module: "warehouse",
        },
        {
          name: "Stock Report",
          icon: ChartBarIcon,
          color: "bg-purple-100 text-purple-600",
          module: "warehouse",
        },
      ],
      "Transport Manager": [
        {
          name: "Schedule Trip",
          icon: TruckIcon,
          color: "bg-orange-100 text-orange-600",
          module: "transport",
        },
        {
          name: "Track Vehicle",
          icon: MapPinIcon,
          color: "bg-blue-100 text-blue-600",
          module: "transport",
        },
        {
          name: "Maintenance",
          icon: WrenchIcon,
          color: "bg-red-100 text-red-600",
          module: "transport",
        },
        {
          name: "Driver Mgmt",
          icon: UsersIcon,
          color: "bg-green-100 text-green-600",
          module: "transport",
        },
      ],
      Accounts: [
        {
          name: "Add Customer",
          icon: UsersIcon,
          color: "bg-blue-100 text-blue-600",
          module: "sales",
        },
        {
          name: "Generate Invoice",
          icon: CurrencyRupeeIcon,
          color: "bg-purple-100 text-purple-600",
          module: "finance",
        },
        {
          name: "Record Payment",
          icon: BanknotesIcon,
          color: "bg-green-100 text-green-600",
          module: "finance",
        },
        {
          name: "View Ledger",
          icon: BookOpenIcon,
          color: "bg-orange-100 text-orange-600",
          module: "finance",
        },
      ],
      Management: [
        {
          name: "View Reports",
          icon: ChartBarIcon,
          color: "bg-blue-100 text-blue-600",
          module: "dashboard",
        },
        {
          name: "Performance",
          icon: ChartBarIcon,
          color: "bg-green-100 text-green-600",
          module: "dashboard",
        },
        {
          name: "Revenue Summary",
          icon: CurrencyRupeeIcon,
          color: "bg-purple-100 text-purple-600",
          module: "finance",
        },
        {
          name: "Analytics",
          icon: ChartBarIcon,
          color: "bg-orange-100 text-orange-600",
          module: "dashboard",
        },
      ],
    };

    return actions[role] || actions["Admin"];
  };

  // Role-based recent activities
  const getRecentActivities = (role, purchaseRes, tripsRes, salesRes) => {
    const activities = [];

    if (role === "Admin" || role === "Management") {
      // Sab kuch dikhao
      purchaseRes.data?.slice(0, 2).forEach((po) => {
        activities.push({
          id: po.id,
          type: "purchase",
          description: `PO ${po.po_number} created`,
          time: new Date(po.order_date).toLocaleDateString(),
          status: po.status,
        });
      });

      tripsRes.data?.slice(0, 2).forEach((trip) => {
        activities.push({
          id: trip.id,
          type: "delivery",
          description: `Trip to ${trip.destination_warehouse}`,
          time: new Date(trip.trip_date).toLocaleDateString(),
          status: trip.status,
        });
      });
    } else if (role === "Warehouse Manager") {
      // Sirf stock related activities
      purchaseRes.data?.slice(0, 3).forEach((po) => {
        activities.push({
          id: po.id,
          type: "purchase",
          description: `New PO ${po.po_number} for stock`,
          time: new Date(po.order_date).toLocaleDateString(),
          status: po.status,
        });
      });

      // Stock movements add karo
      activities.push({
        id: 1001,
        type: "stock",
        description: "Stock inventory updated",
        time: "Today",
        status: "completed",
      });
    } else if (role === "Transport Manager") {
      // Sirf transport related activities
      tripsRes.data?.slice(0, 3).forEach((trip) => {
        activities.push({
          id: trip.id,
          type: "delivery",
          description: `Trip ${trip.vehicle_no} to ${trip.destination_warehouse}`,
          time: new Date(trip.trip_date).toLocaleDateString(),
          status: trip.status,
        });
      });

      // Vehicle maintenance
      activities.push({
        id: 2001,
        type: "maintenance",
        description: "Vehicle maintenance scheduled",
        time: "Tomorrow",
        status: "pending",
      });
    } else if (role === "Accounts") {
      // Sirf finance related activities
      salesRes.data?.slice(0, 2).forEach((order) => {
        activities.push({
          id: order.id,
          type: "payment",
          description: `Invoice for ${order.customer_name}`,
          time: new Date(order.order_date).toLocaleDateString(),
          status: order.status === "delivered" ? "completed" : "pending",
        });
      });

      activities.push({
        id: 3001,
        type: "payment",
        description: "Monthly financial report generated",
        time: "Today",
        status: "completed",
      });
    }

    return activities;
  };

  const quickActions = getQuickActions(user?.role);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [purchaseRes, stockRes, tripsRes, salesRes] = await Promise.all([
        apiCall(API_ENDPOINTS.PURCHASE_ORDERS),
        apiCall(API_ENDPOINTS.STOCK),
        apiCall(API_ENDPOINTS.TRIPS),
        apiCall(API_ENDPOINTS.SALES_ORDERS),
      ]);

      // Calculate stats from real data
      const totalStock =
        stockRes.data?.reduce(
          (sum, item) => sum + (parseFloat(item.quantity_available) || 0),
          0
        ) || 0;
      const pendingOrders =
        purchaseRes.data?.filter((po) => po.status === "pending").length || 0;
      const activeTrips =
        tripsRes.data?.filter((trip) => trip.status === "in_transit").length ||
        0;
      const totalRevenue =
        salesRes.data?.reduce(
          (sum, order) => sum + (parseFloat(order.total_amount) || 0),
          0
        ) || 0;

      setStats([
        {
          title: "Total Stock",
          value: `${totalStock.toFixed(0)} Tons`,
          change: "+12%",
          trend: "up",
          icon: BuildingStorefrontIcon,
          color: "bg-blue-500",
        },
        {
          title: "Pending Orders",
          value: pendingOrders.toString(),
          change: "-5%",
          trend: "down",
          icon: ShoppingCartIcon,
          color: "bg-orange-500",
        },
        {
          title: "Active Trips",
          value: activeTrips.toString(),
          change: "+2%",
          trend: "up",
          icon: TruckIcon,
          color: "bg-green-500",
        },
        {
          title: "Revenue",
          value: `₹${(totalRevenue / 100000).toFixed(1)}L`,
          change: "+18%",
          trend: "up",
          icon: CurrencyRupeeIcon,
          color: "bg-purple-500",
        },
      ]);

      // Generate role-based activities
      const recentActivities = getRecentActivities(
        user?.role,
        purchaseRes,
        tripsRes,
        salesRes
      );
      setActivities(recentActivities);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
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
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.name} ({user?.role})
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-orange-600 transition-colors"
            onClick={fetchDashboardData}
          >
            Refresh Data
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} index={index} />
        ))}
      </motion.div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities - Show only for relevant roles */}
        {(user?.role === "Admin" || user?.role === "Management") && (
          <RecentActivity activities={activities} />
        )}

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
            {quickActions.map((action) => (
              <motion.button
                key={action.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${action.color} p-4 rounded-lg text-center font-medium hover:shadow-md transition-shadow`}
              >
                <action.icon className="w-8 h-8 mx-auto mb-2" />
                {action.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
