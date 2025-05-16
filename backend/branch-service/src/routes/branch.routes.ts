// src/routes/branch.routes.ts
import express from 'express';

const router = express.Router();

import {
  adjustBranchStock,
  approveRestockRequest,
  createBranch,
  createRestockRequest,
  createStockRequest,
  getAllBranches,
  getBranchesByWarehouseId,
  getBranchStock,
  getBranchWithWarehouseInfo,
  rejectRestockRequest,
} from '../controllers/branch.controller';


router.get('/branches/warehouse/:warehouseId', getBranchesByWarehouseId);
router.get('/branch-with-warehouse/:branchId', getBranchWithWarehouseInfo);//between two microservices

router.post('/branches', createBranch);
router.get('/branches', getAllBranches);

router.get('/branches/:id/stock', getBranchStock);
router.post('/branches/:id/stock-adjust', adjustBranchStock);

router.post('/branches/:id/restock', createRestockRequest);

router.post('/branches/:branchId/restock/:restockId/approve', approveRestockRequest);
router.post('/branches/:branchId/restock/:restockId/reject', rejectRestockRequest);
router.post('/stock-requests', createStockRequest);

export default router;
