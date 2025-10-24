import React from "react";
import { motion } from "framer-motion";

const Transportation = ({ user }) => {
  const activeTrips = [
    {
      id: "TRIP001",
      vehicle: "MH12AB1234",
      route: "Mumbai → Delhi",
      status: "In Transit",
      driver: "Ramesh Yadav",
    },
    {
      id: "TRIP002",
      vehicle: "GJ01CD5678",
      route: "Delhi → Chennai",
      status: "Scheduled",
      driver: "Suresh Patel",
    },
    {
      id: "TRIP003",
      vehicle: "KA03EF9012",
      route: "Mumbai → Chennai",
      status: "In Transit",
      driver: "Mahesh Kumar",
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
            Transportation Management
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor fleet operations and trip management
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-orange-600 transition-colors mt-4 sm:mt-0"
        >
          Schedule New Trip
        </motion.button>
      </motion.div>

      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Active Vehicles", value: "12", color: "bg-green-500" },
          { title: "In Maintenance", value: "2", color: "bg-yellow-500" },
          { title: "Active Trips", value: "8", color: "bg-blue-500" },
          { title: "Today Deliveries", value: "15", color: "bg-purple-500" },
        ].map((stat, index) => (
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

      {/* Active Trips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Active Trips
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">
                  Trip ID
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">
                  Vehicle
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">
                  Route
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">
                  Driver
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {activeTrips.map((trip) => (
                <tr
                  key={trip.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 text-sm font-medium text-gray-900">
                    {trip.id}
                  </td>
                  <td className="py-3 text-sm text-gray-600">{trip.vehicle}</td>
                  <td className="py-3 text-sm text-gray-600">{trip.route}</td>
                  <td className="py-3 text-sm text-gray-600">{trip.driver}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        trip.status === "In Transit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {trip.status}
                    </span>
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

export default Transportation;
