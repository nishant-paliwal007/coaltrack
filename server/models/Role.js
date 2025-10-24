import { pool } from "../config/database.js";

class Role {
  static async getAll() {
    const [rows] = await pool.execute("SELECT * FROM roles ORDER BY id");
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM roles WHERE id = ?", [id]);
    return rows[0];
  }
}

export default Role;
