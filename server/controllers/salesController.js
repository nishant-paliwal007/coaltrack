import { pool } from '../config/database.js';

export const getSalesOrders = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT so.*, c.name as customer_name 
      FROM sales_orders so 
      JOIN customers c ON so.customer_id = c.id 
      ORDER BY so.order_date DESC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get sales orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales orders'
    });
  }
};

export const createSalesOrder = async (req, res) => {
  try {
    const { customer_id, order_date, required_delivery_date, items } = req.body;
    
    const total_quantity = items.reduce((sum, item) => sum + parseFloat(item.quantity), 0);
    
    const [result] = await pool.execute(
      `INSERT INTO sales_orders 
       (customer_id, order_date, required_delivery_date, total_quantity, status) 
       VALUES (?, ?, ?, ?, 'pending')`,
      [customer_id, order_date, required_delivery_date, total_quantity]
    );
    
    // Insert items
    for (const item of items) {
      await pool.execute(
        `INSERT INTO sales_order_items (sales_order_id, coal_grade_id, quantity, rate, total_amount) 
         VALUES (?, ?, ?, ?, ?)`,
        [result.insertId, item.coal_grade_id, item.quantity, item.rate, item.quantity * item.rate]
      );
    }
    
    res.status(201).json({
      success: true,
      message: 'Sales order created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create sales order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sales order'
    });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM customers WHERE status = "active"');
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers'
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.execute(
      'UPDATE sales_orders SET status = ? WHERE id = ?',
      [status, id]
    );
    
    res.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};