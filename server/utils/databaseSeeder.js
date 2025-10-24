import { pool } from "../config/database.js";
import { hashPassword } from "./passwordUtils.js";

const seedDatabase = async () => {
  try {
    console.log("🌱 Seeding database...");

    // Insert roles
    const roles = [
      {
        role_name: "Admin",
        description: "System administrator with full access",
      },
      {
        role_name: "Warehouse Manager",
        description: "Manages warehouse operations and stock",
      },
      {
        role_name: "Transport Manager",
        description: "Manages vehicles and transportation",
      },
      { role_name: "Accounts", description: "Handles finance and accounts" },
      {
        role_name: "Management",
        description: "Top management for approvals and reports",
      },
    ];

    for (const role of roles) {
      await pool.execute(
        "INSERT IGNORE INTO roles (role_name, description) VALUES (?, ?)",
        [role.role_name, role.description]
      );
    }

    // Get role IDs
    const [roleRows] = await pool.execute("SELECT * FROM roles");
    const rolesMap = {};
    roleRows.forEach((role) => {
      rolesMap[role.role_name] = role.id;
    });

    // Insert admin user
    const adminPassword = await hashPassword("admin123");
    await pool.execute(
      `INSERT IGNORE INTO users (name, email, password, role_id, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        "System Admin",
        "admin@coalcorp.com",
        adminPassword,
        rolesMap["Admin"],
        "active",
      ]
    );

    // Insert sample users for each role
    const sampleUsers = [
      {
        name: "Rajesh Kumar",
        email: "rajesh.kumar@coalcorp.com",
        role: "Admin",
        password: "password123",
      },
      {
        name: "Priya Sharma",
        email: "priya.sharma@coalcorp.com",
        role: "Warehouse Manager",
        password: "password123",
      },
      {
        name: "Amit Singh",
        email: "amit.singh@coalcorp.com",
        role: "Transport Manager",
        password: "password123",
      },
      {
        name: "Neha Gupta",
        email: "neha.gupta@coalcorp.com",
        role: "Accounts",
        password: "password123",
      },
      {
        name: "Vikram Patel",
        email: "vikram.patel@coalcorp.com",
        role: "Management",
        password: "password123",
      },
    ];

    for (const user of sampleUsers) {
      const hashedPassword = await hashPassword(user.password);
      await pool.execute(
        `INSERT IGNORE INTO users (name, email, password, role_id, status) 
         VALUES (?, ?, ?, ?, ?)`,
        [user.name, user.email, hashedPassword, rolesMap[user.role], "active"]
      );
    }

    console.log("✅ Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
