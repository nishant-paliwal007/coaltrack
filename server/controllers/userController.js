import { pool } from "../config/database.js";
import { hashPassword } from "../utils/passwordUtils.js";

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT u.id, u.name, u.email, r.role_name as role, u.status, u.created_at 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      ORDER BY u.created_at DESC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    // Check if user already exists
    const [existing] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Check if role exists
    const [role] = await pool.execute("SELECT * FROM roles WHERE id = ?", [
      role_id,
    ]);
    if (role.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const hashedPassword = await hashPassword(password);
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password, role_id, status) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, role_id, "active"]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role_id, status } = req.body;

    const [result] = await pool.execute(
      "UPDATE users SET name = ?, email = ?, role_id = ?, status = ? WHERE id = ?",
      [name, email, role_id, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

export const getRoles = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM roles ORDER BY id");

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get roles error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
    });
  }
};
