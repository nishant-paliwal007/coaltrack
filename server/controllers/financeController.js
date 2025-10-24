import { pool } from '../config/database.js';

export const getInvoices = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT i.*, so.id as order_id, c.name as customer_name
      FROM invoices i
      JOIN sales_orders so ON i.order_id = so.id
      JOIN customers c ON so.customer_id = c.id
      ORDER BY i.invoice_date DESC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices'
    });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const { order_id, invoice_date, amount } = req.body;
    
    const [result] = await pool.execute(
      `INSERT INTO invoices (order_id, invoice_date, amount, status) 
       VALUES (?, ?, ?, 'pending')`,
      [order_id, invoice_date, amount]
    );
    
    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice'
    });
  }
};

export const getPayments = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, i.id as invoice_id, c.name as customer_name
      FROM payments p
      JOIN invoices i ON p.invoice_id = i.id
      JOIN sales_orders so ON i.order_id = so.id
      JOIN customers c ON so.customer_id = c.id
      ORDER BY p.payment_date DESC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments'
    });
  }
};

export const recordPayment = async (req, res) => {
  try {
    const { invoice_id, payment_date, amount, payment_mode } = req.body;
    
    const [result] = await pool.execute(
      `INSERT INTO payments (invoice_id, payment_date, amount, payment_mode, status) 
       VALUES (?, ?, ?, ?, 'completed')`,
      [invoice_id, payment_date, amount, payment_mode]
    );
    
    // Update invoice status
    await pool.execute(
      'UPDATE invoices SET status = "paid" WHERE id = ?',
      [invoice_id]
    );
    
    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payment'
    });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT e.*, t.id as trip_id, v.vehicle_no
      FROM expenses e
      LEFT JOIN trips t ON e.trip_id = t.id
      LEFT JOIN vehicles v ON t.vehicle_id = v.id
      ORDER BY e.date DESC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expenses'
    });
  }
};