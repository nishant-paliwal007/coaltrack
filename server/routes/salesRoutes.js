import express from 'express';
import { 
  getSalesOrders, 
  createSalesOrder, 
  updateOrderStatus 
} from '../controllers/salesController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { requireAdmin, requireAccounts } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/orders', authenticateToken, requireAccounts, getSalesOrders);
router.post('/orders', authenticateToken, requireAccounts, createSalesOrder);
router.put('/orders/:id/status', authenticateToken, requireAccounts, updateOrderStatus);

export default router;