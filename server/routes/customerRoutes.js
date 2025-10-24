import express from "express";
import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  requireAdmin,
  requireAccounts,
} from "../middlewares/roleMiddleware.js";

const router = express.Router();

// router.get("/", authenticateToken, requireAdmin, getAllCustomers);
// router.post("/", authenticateToken, requireAdmin, createCustomer);
// router.put("/:id", authenticateToken, requireAdmin, updateCustomer);
// router.delete("/:id", authenticateToken, requireAdmin, deleteCustomer);
// ✅ Accounts ko bhi allow karo customer operations ke liye
router.get("/", authenticateToken, requireAccounts, getAllCustomers);
router.post("/", authenticateToken, requireAccounts, createCustomer);
router.put("/:id", authenticateToken, requireAccounts, updateCustomer);
router.delete("/:id", authenticateToken, requireAdmin, deleteCustomer); // Delete sirf Admin kar sake
export default router;
