import mongoose from 'mongoose';
import Order from '../models/Order.js';

// @desc    Get order details by ID or Order Number
// @route   GET /api/orders/:identifier
export const getOrderByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    let order = null;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      order = await Order.findById(identifier).populate('items.product', 'name slug images');
    }

    if (!order) {
      order = await Order.findOne({ orderNumber: identifier }).populate('items.product', 'name slug images');
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order history (optionally filtered by email)
// @route   GET /api/orders
export const getOrders = async (req, res, next) => {
  try {
    const { email } = req.query;

    const query = {};
    if (email && email.trim() !== '') {
      query['shippingAddress.email'] = email.trim().toLowerCase();
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};
