import express from "express";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getRoles,
} from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, requireAdmin, getAllUsers);
router.get("/roles", authenticateToken, requireAdmin, getRoles);
router.post("/", authenticateToken, requireAdmin, createUser);
router.put("/:id", authenticateToken, requireAdmin, updateUser);
router.delete("/:id", authenticateToken, requireAdmin, deleteUser);

export default router;
