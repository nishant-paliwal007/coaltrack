import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import { 
  ChartBarIcon,
  ShoppingCartIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  CurrencyRupeeIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Stock',
      value: '1,250 Tons',
      change: '+12%',
      trend: 'up',
      icon: BuildingStorefrontIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Orders',
      value: '24',
      change: '-5%',
      trend: 'down',
      icon: ShoppingCartIcon,
      color: 'bg-orange-500'
    },
    {
      title: 'Active Trips',
      value: '8',
      change: '+2%',
      trend: 'up',
      icon: TruckIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Revenue',
      value: '₹45.2L',
      change: '+18%',
      trend: 'up',
      icon: CurrencyRupeeIcon,
      color: 'bg-purple-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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
          <p className="mt-2 text-gray-600">Welcome to Coal Logistics ERP System</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-orange-600 transition-colors"
          >
            Generate Report
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
        {/* Recent Activity */}
        <RecentActivity />
        
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Create PO', icon: ShoppingCartIcon, color: 'bg-blue-100 text-blue-600' },
              { name: 'Add Stock', icon: BuildingStorefrontIcon, color: 'bg-green-100 text-green-600' },
              { name: 'Schedule Trip', icon: TruckIcon, color: 'bg-orange-100 text-orange-600' },
              { name: 'Generate Invoice', icon: CurrencyRupeeIcon, color: 'bg-purple-100 text-purple-600' }
            ].map((action) => (
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