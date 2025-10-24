import React from 'react';
import { motion } from 'framer-motion';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'purchase',
      description: 'New PO #PO/2024/001 created',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'delivery',
      description: 'Coal delivery from Coal India',
      time: '4 hours ago',
      status: 'in-progress'
    },
    {
      id: 3,
      type: 'payment',
      description: 'Payment received from Tata Power',
      time: '1 day ago',
      status: 'completed'
    },
    {
      id: 4,
      type: 'maintenance',
      description: 'Vehicle MH12AB1234 maintenance due',
      time: '2 days ago',
      status: 'pending'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'purchase': return '🛒';
      case 'delivery': return '🚚';
      case 'payment': return '💰';
      case 'maintenance': return '🔧';
      default: return '📝';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="text-2xl">{getTypeIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {activity.description}
              </p>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
              {activity.status}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentActivity;