// src/controllers/branch.controller.ts
import { Request, Response } from 'express';
import Branch from '../models/branch.model';

export const createBranch = (req: Request, res: Response) => {
  const { name, location, warehouseId, managerId } = req.body;
  const newBranch = new Branch({ name, location, warehouseId, managerId });

  newBranch.save()
    .then((savedBranch) => {
      res.status(201).json({
        message: 'Branch created successfully',
        data: savedBranch,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Server error', error });
    });
};

export const getAllBranches = (req: Request, res: Response) => {
  Branch.find()
    .then((branches) => {
      res.status(200).json({
        message: 'Branches fetched successfully',
        data: branches,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Server error', error });
    });
};

export const getBranchesByWarehouseId = (req: Request, res: Response) => {
  const { warehouseId } = req.params;

  Branch.find({ warehouseId })
    .then((branches) => {
      if (branches.length === 0) {
        return res.status(404).json({
          message: 'No branches found for this warehouse',
          data: [],
        });
      }
      res.status(200).json({
        message: 'Branches fetched successfully',
        data: branches,
      });
    })
    .catch((error) => {
      console.error('Error fetching branches by warehouseId:', error);
      res.status(500).json({ message: 'Server error', error });
    });
};

import axios from 'axios';

const WAREHOUSE_SERVICE_URL = 'http://localhost:5003/api';

export const getBranchWithWarehouseInfo = (req: Request, res: Response) => {
  const { branchId } = req.params;

  Branch.findById(branchId)
    .then(branch => {
      if (!branch) {
        res.status(404).json({ message: 'Branch not found' });
        return;  // ✅ Add this return to stop further execution
      }

      return axios
        .get(`${WAREHOUSE_SERVICE_URL}/warehouses/${branch.warehouseId}`)
        .then(warehouseResponse => {
          res.status(200).json({
            message: 'Branch with warehouse info fetched successfully',
            data: {
              branch,
              warehouse: warehouseResponse.data.data,
            },
          });
        });
    })
    .catch(error => {
      console.error('Error fetching branch with warehouse info:', error);
      res.status(500).json({ message: 'Server error', error });
    });
};


const STOCK_SERVICE_URL = 'http://localhost:5005/api/stocks';

export const getBranchStock = async (req: Request, res: Response) => {
  const { id: branchId } = req.params;

  try {
    const response = await axios.get(`${STOCK_SERVICE_URL}/branch/${branchId}`);
    res.status(200).json({
      message: 'Branch stock fetched successfully',
      data: response.data.data,
    });
  } catch (error: any) {
    console.error('Error fetching branch stock:', error.message);
    res.status(500).json({ message: 'Failed to fetch branch stock' });
  }
};

export const adjustBranchStock = (req: Request, res: Response): void => {
  const { id: branchId } = req.params;
  const { productId, quantityChange } = req.body;

  // 1) fetch existing stock record
  axios
    .get(`${STOCK_SERVICE_URL}/branch/${branchId}/product/${productId}`)
    .then(response => {
      const records = response.data.data;
      if (!records || records.length === 0) {
        return Promise.reject({ status: 404, message: 'Stock record not found for this product in branch' });
      }
      const stockRecord = records[0];
      const newQuantity = stockRecord.quantity + quantityChange;
      const stockId = stockRecord._id;

      // 2) update it with the new quantity
      return axios.put(`${STOCK_SERVICE_URL}/${stockId}`, { quantity: newQuantity });
    })
    .then(updatedResponse => {
      res.status(200).json({
        message: 'Stock adjusted successfully',
        data: updatedResponse.data,
      });
    })
    .catch(err => {
      if (err.status === 404) {
        return res.status(404).json({ message: err.message });
      }
      console.error('Error adjusting stock:', err.message || err);
      res.status(500).json({ message: 'Failed to adjust stock' });
    });
};

import RestockRequest from '../models/restockRequest.model';
// Create a new restock request using Promises
export const createRestockRequest = (req: Request, res: Response): void => {
  const { id: branchId } = req.params;
  const { productId, quantity } = req.body;

  const request = new RestockRequest({ branchId, productId, quantity });

  request
    .save()
    .then(savedRequest => {
      res.status(201).json({ message: 'Restock request created', data: savedRequest });
    })
    .catch(err => {
      console.error('Error creating restock request:', err.message || err);
      res.status(500).json({ message: 'Failed to create restock request' });
    });
};

// Approve a restock request using Promises
export const approveRestockRequest = (req: Request, res: Response): void => {
  const { restockId } = req.params;

  RestockRequest.findByIdAndUpdate(
    restockId,
    { status: 'approved' },
    { new: true }
  )
    .then(updatedRequest => {
      if (!updatedRequest) {
        return Promise.reject({ status: 404, message: 'Restock request not found' });
      }

      // OPTIONAL: If you want to bump the stock automatically, you could chain another promise here:
      // return axios.get(...)
      //   .then(...) // fetch current stock
      //   .then(...) // axios.put to adjust stock
      //   .then(() => updatedRequest);

      res.status(200).json({ message: 'Restock request approved', data: updatedRequest });
    })
    .catch(err => {
      if (err.status === 404) {
        return res.status(404).json({ message: err.message });
      }
      console.error('Error approving restock request:', err.message || err);
      res.status(500).json({ message: 'Failed to approve restock request' });
    });
};

// Reject a restock request using Promises
export const rejectRestockRequest = (req: Request, res: Response): void => {
  const { restockId } = req.params;

  RestockRequest.findByIdAndUpdate(
    restockId,
    { status: 'rejected' },
    { new: true }
  )
    .then(updatedRequest => {
      if (!updatedRequest) {
        return Promise.reject({ status: 404, message: 'Restock request not found' });
      }
      res.status(200).json({ message: 'Restock request rejected', data: updatedRequest });
    })
    .catch(err => {
      if (err.status === 404) {
        return res.status(404).json({ message: err.message });
      }
      console.error('Error rejecting restock request:', err.message || err);
      res.status(500).json({ message: 'Failed to reject restock request' });
    });
};

export const createStockRequest = async (req, res) => {
  const { warehouseId, productId, quantity } = req.body;
  const branchId = req.body.branchId; // or from auth
  
  try {
    const { data } = await axios.post(
      `${STOCK_SERVICE_URL}/stock-requests`,
      { warehouseId, branchId, productId, quantity }
    );
    res.status(201).json({ message: 'Stock request placed', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to place stock request' });
  }
};