import { pool } from '../config/database.js';

export const getPurchaseOrders = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT po.*, s.name as supplier_name 
      FROM purchase_orders po 
      LEFT JOIN suppliers s ON po.supplier_id = s.id 
      ORDER BY po.order_date DESC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get purchase orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchase orders'
    });
  }
};

export const createPurchaseOrder = async (req, res) => {
  try {
    const { supplier_id, order_date, expected_delivery_date, items } = req.body;
    
    const total_quantity = items.reduce((sum, item) => sum + parseFloat(item.quantity), 0);
    
    const [result] = await pool.execute(
      `INSERT INTO purchase_orders 
       (po_number, supplier_id, order_date, expected_delivery_date, total_quantity, status) 
       VALUES (CONCAT('PO/', DATE_FORMAT(NOW(), '%Y/%m/'), LPAD(FLOOR(RAND()*1000), 3, '0')), ?, ?, ?, ?, 'pending')`,
      [supplier_id, order_date, expected_delivery_date, total_quantity]
    );
    
    // Insert items
    for (const item of items) {
      await pool.execute(
        `INSERT INTO purchase_order_items (po_id, coal_grade_id, quantity, rate, total_amount) 
         VALUES (?, ?, ?, ?, ?)`,
        [result.insertId, item.coal_grade_id, item.quantity, item.rate, item.quantity * item.rate]
      );
    }
    
    res.status(201).json({
      success: true,
      message: 'Purchase order created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create purchase order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create purchase order'
    });
  }
};

export const getSuppliers = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM suppliers WHERE status = "active"');
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suppliers'
    });
  }
};