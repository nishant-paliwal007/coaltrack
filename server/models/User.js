import { pool } from "../config/database.js";
import { hashPassword } from "../utils/passwordUtils.js";

class User {
  static async create(userData) {
    const { name, email, password, role_id } = userData;
    const hashedPassword = await hashPassword(password);

    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role_id]
    );

    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT u.*, r.role_name as role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ? AND u.status = 'active'`,
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT u.*, r.role_name as role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.execute(
      `SELECT u.id, u.name, u.email, r.role_name as role, u.status, u.created_at 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       ORDER BY u.created_at DESC`
    );
    return rows;
  }

  static async updateStatus(id, status) {
    await pool.execute("UPDATE users SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
  }
}

export default User;
