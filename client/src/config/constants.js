// API Base URL
export const API_BASE_URL = "http://localhost:5000/api";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  PROFILE: "/auth/profile",
  LOGOUT: "/auth/logout",

  // Users
  USERS: "/users", // ✅ YE LINE ADD KARO


  // Dashboard
  DASHBOARD_STATS: "/dashboard/stats",

  // Procurement
  PURCHASE_ORDERS: "/procurement/purchase-orders",
  SUPPLIERS: "/procurement/suppliers",

  // Warehouse
  STOCK: "/warehouse/stock",
  WAREHOUSES: "/warehouse/warehouses",

  // Transport
  TRIPS: "/transport/trips",
  VEHICLES: "/transport/vehicles",

  // Sales
  SALES_ORDERS: "/sales/orders",
  CUSTOMERS: "/sales/customers",

  // Finance
  INVOICES: "/finance/invoices",
  PAYMENTS: "/finance/payments",
  EXPENSES: "/finance/expenses",
};
