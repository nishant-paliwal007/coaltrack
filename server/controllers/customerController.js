import { pool } from "../config/database.js";

export const getAllCustomers = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM customers ORDER BY id DESC"
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get customers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { name, contact_person, phone, address, credit_limit } = req.body;

    // Validate required fields
    if (!name || !contact_person || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, contact person and phone are required",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO customers (name, contact_person, phone, address, credit_limit, status) 
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [name, contact_person, phone, address, credit_limit || 0]
    );

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Create customer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create customer",
    });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_person, phone, address, credit_limit, status } =
      req.body;

    // Validate required fields
    if (!name || !contact_person || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, contact person and phone are required",
      });
    }

    const [result] = await pool.execute(
      `UPDATE customers 
       SET name = ?, contact_person = ?, phone = ?, address = ?, credit_limit = ?, status = ? 
       WHERE id = ?`,
      [name, contact_person, phone, address, credit_limit, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Customer updated successfully",
    });
  } catch (error) {
    console.error("Update customer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update customer",
    });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute("DELETE FROM customers WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Delete customer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete customer",
    });
  }
};
