import { pool } from "../config/database.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Get total stock
    const [stockRows] = await pool.execute(
      "SELECT SUM(quantity_available) as total_stock FROM stock"
    );

    // Get pending orders
    const [orderRows] = await pool.execute(
      'SELECT COUNT(*) as pending_orders FROM purchase_orders WHERE status = "pending"'
    );

    // Get active trips
    const [tripRows] = await pool.execute(
      'SELECT COUNT(*) as active_trips FROM trips WHERE status = "in_transit"'
    );

    // Get total revenue (from paid invoices)
    const [revenueRows] = await pool.execute(
      'SELECT SUM(amount) as total_revenue FROM invoices WHERE status = "paid"'
    );

    res.json({
      success: true,
      data: {
        total_stock: stockRows[0].total_stock || 0,
        pending_orders: orderRows[0].pending_orders || 0,
        active_trips: tripRows[0].active_trips || 0,
        total_revenue: revenueRows[0].total_revenue || 0,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};
