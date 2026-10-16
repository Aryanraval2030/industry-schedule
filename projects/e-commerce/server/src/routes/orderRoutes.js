import express from 'express';
import {
  getOrderByIdentifier,
  getOrders,
} from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getOrders);
router.get('/:identifier', getOrderByIdentifier);

export default router;
