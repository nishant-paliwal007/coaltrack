import { pool } from '../config/database.js';

export const getStock = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT s.*, w.name as warehouse_name, cg.grade_name 
      FROM stock s 
      JOIN warehouses w ON s.warehouse_id = w.id 
      JOIN coal_grades cg ON s.coal_grade_id = cg.id 
      ORDER BY w.name, cg.grade_name
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock data'
    });
  }
};

export const getWarehouses = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM warehouses');
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get warehouses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch warehouses'
    });
  }
};

export const addStock = async (req, res) => {
  try {
    const { warehouse_id, coal_grade_id, quantity } = req.body;
    
    // Check if stock exists
    const [existing] = await pool.execute(
      'SELECT * FROM stock WHERE warehouse_id = ? AND coal_grade_id = ?',
      [warehouse_id, coal_grade_id]
    );
    
    if (existing.length > 0) {
      // Update existing stock
      await pool.execute(
        'UPDATE stock SET quantity_available = quantity_available + ? WHERE warehouse_id = ? AND coal_grade_id = ?',
        [quantity, warehouse_id, coal_grade_id]
      );
    } else {
      // Insert new stock
      await pool.execute(
        'INSERT INTO stock (warehouse_id, coal_grade_id, quantity_available) VALUES (?, ?, ?)',
        [warehouse_id, coal_grade_id, quantity]
      );
    }
    
    // Record stock movement
    await pool.execute(
      `INSERT INTO stock_movements (stock_id, movement_type, quantity, reference_id, remarks) 
       VALUES ((SELECT id FROM stock WHERE warehouse_id = ? AND coal_grade_id = ?), 'IN', ?, NULL, 'Manual stock addition')`,
      [warehouse_id, coal_grade_id, quantity]
    );
    
    res.json({
      success: true,
      message: 'Stock added successfully'
    });
  } catch (error) {
    console.error('Add stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add stock'
    });
  }
};