import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TruckIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Hardcoded users for demo (Backend me proper database use karenge)
  const demoUsers = [
    { email: 'rajesh.kumar@coalcorp.com', password: 'password123', name: 'Rajesh Kumar', role: 'Admin' },
    { email: 'priya.sharma@coalcorp.com', password: 'password123', name: 'Priya Sharma', role: 'Warehouse Manager' },
    { email: 'amit.singh@coalcorp.com', password: 'password123', name: 'Amit Singh', role: 'Transport Manager' },
    { email: 'neha.gupta@coalcorp.com', password: 'password123', name: 'Neha Gupta', role: 'Accounts' },
    { email: 'vikram.patel@coalcorp.com', password: 'password123', name: 'Vikram Patel', role: 'Management' }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in demo users
      const user = demoUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Remove password before storing
        const { password: _, ...userWithoutPassword } = user;
        
        // Store in localStorage (temporary solution)
        localStorage.setItem('coalERP_user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('coalERP_token', 'demo-token-' + Date.now());
        
        onLogin(userWithoutPassword);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials fill handler
  const fillDemoCredentials = (userType) => {
    const user = demoUsers.find(u => u.role === userType);
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <TruckIcon className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900">CoalERP</h1>
          <p className="text-gray-600 mt-2">Log in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8">
          <p className="text-center text-sm text-gray-600 mb-4">Demo Credentials:</p>
          <div className="grid grid-cols-2 gap-2">
            {['Admin', 'Warehouse Manager', 'Transport Manager', 'Accounts'].map((role) => (
              <motion.button
                key={role}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fillDemoCredentials(role)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition-colors"
              >
                {role}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            For demo purposes only. Backend implementation will include proper password hashing.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;