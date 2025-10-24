export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Role-based middleware shortcuts
export const requireAdmin = requireRole(['Admin']);
export const requireWarehouseManager = requireRole(['Admin', 'Warehouse Manager']);
export const requireTransportManager = requireRole(['Admin', 'Transport Manager']);
export const requireAccounts = requireRole(['Admin', 'Accounts']);
export const requireManagement = requireRole(['Admin', 'Management']);