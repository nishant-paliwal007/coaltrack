import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiCall } from '../../utils/api.js';
import { API_ENDPOINTS } from '../../config/constants.js';

const Transportation = ({ user }) => {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransportData();
  }, []);

  const fetchTransportData = async () => {
    try {
      setLoading(true);
      const [tripsResponse, vehiclesResponse] = await Promise.all([
        apiCall(API_ENDPOINTS.TRIPS),
        apiCall(API_ENDPOINTS.VEHICLES)
      ]);

      setTrips(tripsResponse.data || []);
      setVehicles(vehiclesResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch transport data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      title: 'Active Vehicles', 
      value: vehicles.filter(v => v.status === 'active').length.toString()
    },
    { 
      title: 'In Maintenance', 
      value: vehicles.filter(v => v.status === 'maintenance').length.toString()
    },
    { 
      title: 'Active Trips', 
      value: trips.filter(t => t.status === 'in_transit').length.toString()
    },
    { 
      title: 'Completed Today', 
      value: trips.filter(t => 
        t.status === 'delivered' && 
        new Date(t.trip_date).toDateString() === new Date().toDateString()
      ).length.toString()
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Transportation Management</h1>
          <p className="mt-2 text-gray-600">Monitor fleet operations and trip management</p>
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
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Trip Management</h3>
          <span className="text-sm text-gray-500">
            {trips.length} total trips
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">Trip ID</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Vehicle</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Route</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Driver</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Quantity</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Trip Date</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium text-gray-900">TRIP{trip.id.toString().padStart(3, '0')}</td>
                  <td className="py-3 text-sm text-gray-600">{trip.vehicle_no}</td>
                  <td className="py-3 text-sm text-gray-600">
                    {trip.source_warehouse} → {trip.destination_warehouse}
                  </td>
                  <td className="py-3 text-sm text-gray-600">{trip.driver_name}</td>
                  <td className="py-3 text-sm text-gray-600">{trip.quantity} Tons</td>
                  <td className="py-3 text-sm text-gray-600">
                    {new Date(trip.trip_date).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(trip.status)}`}>
                      {trip.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {trips.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-500">
                    No trips found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Vehicles List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{vehicle.vehicle_no}</h4>
                  <p className="text-sm text-gray-600 mt-1">Driver: {vehicle.driver_name}</p>
                  <p className="text-sm text-gray-500">Capacity: {vehicle.capacity} Tons</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                  vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {vehicle.status}
                </span>
              </div>
              <div className="mt-3 flex items-center space-x-2">
                <span className="text-sm text-gray-500">Contact:</span>
                <span className="text-sm font-medium">{vehicle.driver_phone}</span>
              </div>
            </div>
          ))}
          {vehicles.length === 0 && (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No vehicles found
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Transportation;