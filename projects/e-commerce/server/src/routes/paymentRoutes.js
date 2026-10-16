import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  getRazorpayConfig,
  createDemoOrder,
  confirmDemoPayment,
} from '../controllers/paymentController.js';

const router = express.Router();

// Demo payment simulation routes (No Razorpay keys required)
router.post('/demo/create-order', createDemoOrder);
router.post('/demo/confirm', confirmDemoPayment);

// Razorpay test mode routes
router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.post('/failure', handlePaymentFailure);
router.get('/config', getRazorpayConfig);

export default router;
