import { pool } from '../config/database.js';

export const getTrips = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT t.*, 
             v.vehicle_no, v.driver_name, v.driver_phone,
             sw.name as source_warehouse, 
             dw.name as destination_warehouse,
             cg.grade_name
      FROM trips t
      JOIN vehicles v ON t.vehicle_id = v.id
      JOIN warehouses sw ON t.source_warehouse_id = sw.id
      JOIN warehouses dw ON t.destination_warehouse_id = dw.id
      JOIN coal_grades cg ON t.coal_grade_id = cg.id
      ORDER BY t.trip_date DESC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trips'
    });
  }
};

export const createTrip = async (req, res) => {
  try {
    const { vehicle_id, driver_id, source_warehouse_id, destination_warehouse_id, coal_grade_id, quantity, trip_date } = req.body;
    
    const [result] = await pool.execute(
      `INSERT INTO trips 
       (vehicle_id, driver_id, source_warehouse_id, destination_warehouse_id, coal_grade_id, quantity, trip_date, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled')`,
      [vehicle_id, driver_id, source_warehouse_id, destination_warehouse_id, coal_grade_id, quantity, trip_date]
    );
    
    res.status(201).json({
      success: true,
      message: 'Trip scheduled successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule trip'
    });
  }
};

export const getVehicles = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM vehicles WHERE status = "active"');
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicles'
    });
  }
};

export const updateTripStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.execute(
      'UPDATE trips SET status = ? WHERE id = ?',
      [status, id]
    );
    
    res.json({
      success: true,
      message: 'Trip status updated successfully'
    });
  } catch (error) {
    console.error('Update trip status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update trip status'
    });
  }
};