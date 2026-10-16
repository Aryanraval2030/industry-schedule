import crypto from 'crypto';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { getRazorpayInstance } from '../config/razorpay.js';

// @desc    Create Razorpay Order & initialize database order
// @route   POST /api/payment/create-order
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart items are required to create an order.',
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.email ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: 'All shipping address fields are required.',
      });
    }

    // Server-side authoritative price verification & stock check
    let itemsTotal = 0;
    const validatedOrderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId || item.product} not found.`,
        });
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        });
      }

      const lineTotal = product.price * qty;
      itemsTotal += lineTotal;

      validatedOrderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.images[0] || '',
      });
    }

    // Pricing calculation: Free shipping above ₹1500, else ₹99; 18% GST
    const shippingFee = itemsTotal >= 1500 ? 0 : 99;
    const tax = Math.round(itemsTotal * 0.18);
    const grandTotal = itemsTotal + shippingFee + tax;
    const amountInPaise = Math.round(grandTotal * 100);

    // Call Razorpay API to generate order
    const razorpay = getRazorpayInstance();
    const razorpayOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now().toString().slice(-8)}`,
      notes: {
        customerEmail: shippingAddress.email,
        customerName: shippingAddress.fullName,
      },
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(razorpayOptions);
    } catch (rzpErr) {
      console.error('[Razorpay Order Creation Error]', rzpErr);
      return res.status(502).json({
        success: false,
        message: 'Failed to create Razorpay payment order. Check test API keys.',
        error: rzpErr.error ? rzpErr.error.description : rzpErr.message,
      });
    }

    // Generate unique order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${dateStr}-${randomSuffix}`;

    // Store order in MongoDB with status 'created'
    const newOrder = await Order.create({
      orderNumber,
      items: validatedOrderItems,
      shippingAddress,
      pricing: {
        itemsTotal,
        shippingFee,
        tax,
        grandTotal,
      },
      payment: {
        method: 'Razorpay',
        razorpayOrderId: razorpayOrder.id,
        status: 'created',
      },
      orderStatus: 'Placed',
    });

    res.status(201).json({
      success: true,
      orderId: newOrder._id,
      orderNumber: newOrder.orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID || '',
      pricing: newOrder.pricing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment signature & confirm order
// @route   POST /api/payment/verify
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required Razorpay payment verification parameters.',
      });
    }

    // Cryptographic HMAC SHA-256 verification
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay secret key not configured on server.',
      });
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const isSignatureValid = generatedSignature === razorpay_signature;

    // Locate order in DB
    const order = orderId
      ? await Order.findById(orderId)
      : await Order.findOne({ 'payment.razorpayOrderId': razorpay_order_id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order corresponding to this payment was not found.',
      });
    }

    // Idempotency check: If order has already been verified and paid, return success without duplicate stock deduction
    if (order.payment.status === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Payment has already been verified and confirmed.',
        orderId: order._id,
        orderNumber: order.orderNumber,
        alreadyVerified: true,
      });
    }

    if (!isSignatureValid) {
      // Record failed verification in database
      order.payment.status = 'failed';
      order.payment.failureReason = 'Cryptographic signature mismatch';
      await order.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: invalid signature.',
      });
    }

    // Atomic update: only update if payment.status is not already 'paid'
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: order._id,
        'payment.status': { $ne: 'paid' },
      },
      {
        $set: {
          'payment.razorpayPaymentId': razorpay_payment_id,
          'payment.razorpaySignature': razorpay_signature,
          'payment.status': 'paid',
          'payment.paidAt': new Date(),
          orderStatus: 'Processing',
        },
      },
      { new: true }
    );

    // If another concurrent request already marked it paid, do not decrement stock again
    if (!updatedOrder) {
      return res.status(200).json({
        success: true,
        message: 'Payment has already been verified and confirmed.',
        orderId: order._id,
        orderNumber: order.orderNumber,
        alreadyVerified: true,
      });
    }

    // Decrement stock for purchased items safely
    for (const item of updatedOrder.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully and order confirmed.',
      orderId: updatedOrder._id,
      orderNumber: updatedOrder.orderNumber,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record payment failure / cancellation
// @route   POST /api/payment/failure
export const handlePaymentFailure = async (req, res, next) => {
  try {
    const { orderId, razorpay_order_id, reason } = req.body;

    const order = orderId
      ? await Order.findById(orderId)
      : await Order.findOne({ 'payment.razorpayOrderId': razorpay_order_id });

    if (order) {
      order.payment.status = 'failed';
      order.payment.failureReason = reason || 'Payment cancelled by user or gateway declined.';
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment failure recorded.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public Razorpay Key ID
export const getRazorpayConfig = (req, res) => {
  res.status(200).json({
    success: true,
    keyId: process.env.RAZORPAY_KEY_ID || '',
  });
};

// ==========================================
// DEMO PAYMENT SIMULATION CONTROLLERS
// (No Razorpay credentials required)
// ==========================================

// @desc    Create Demo Simulation Order with authoritative server-side price calculation
// @route   POST /api/payment/demo/create-order
export const createDemoOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart items are required to create an order.',
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.email ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: 'All shipping address fields are required.',
      });
    }

    // Authoritative server-side price recalculation and stock check from MongoDB
    let itemsTotal = 0;
    const validatedOrderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId || item.product} not found.`,
        });
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        });
      }

      const lineTotal = product.price * qty;
      itemsTotal += lineTotal;

      validatedOrderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.images[0] || '',
      });
    }

    // Pricing calculation: Free shipping above ₹1500, else ₹99; 18% GST
    const shippingFee = itemsTotal >= 1500 ? 0 : 99;
    const tax = Math.round(itemsTotal * 0.18);
    const grandTotal = itemsTotal + shippingFee + tax;

    // Generate readable demo order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-DEMO-${dateStr}-${randomSuffix}`;

    // Store in MongoDB with payment method clearly labeled DEMO
    const newOrder = await Order.create({
      orderNumber,
      items: validatedOrderItems,
      shippingAddress,
      pricing: {
        itemsTotal,
        shippingFee,
        tax,
        grandTotal,
      },
      payment: {
        method: 'Demo Payment (Simulated)',
        status: 'created',
        isDemo: true,
      },
      orderStatus: 'Placed',
    });

    res.status(201).json({
      success: true,
      orderId: newOrder._id,
      orderNumber: newOrder.orderNumber,
      pricing: newOrder.pricing,
      items: newOrder.items,
      isDemo: true,
      message: 'Demo order initialized with server-calculated totals.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm or fail Demo Payment Simulation
// @route   POST /api/payment/demo/confirm
export const confirmDemoPayment = async (req, res, next) => {
  try {
    const { orderId, status, failureReason } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and simulation status (SUCCESS or FAILED) are required.',
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    if (status === 'SUCCESS') {
      // Idempotency check: If order has already been verified and paid
      if (order.payment.status === 'paid') {
        return res.status(200).json({
          success: true,
          message: 'Demo payment already confirmed.',
          orderId: order._id,
          orderNumber: order.orderNumber,
          transactionId: order.payment.transactionId || order.payment.razorpayPaymentId,
          alreadyVerified: true,
        });
      }

      // Generate unique demo transaction ID
      const demoTxnId = `DEMO_TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Atomic transition from non-paid to paid (prevents duplicate clicks/race conditions)
      const updatedOrder = await Order.findOneAndUpdate(
        {
          _id: order._id,
          'payment.status': { $ne: 'paid' },
        },
        {
          $set: {
            'payment.method': 'Demo Payment (Simulated)',
            'payment.transactionId': demoTxnId,
            'payment.razorpayPaymentId': demoTxnId,
            'payment.status': 'paid',
            'payment.isDemo': true,
            'payment.paidAt': new Date(),
            orderStatus: 'Processing',
          },
        },
        { new: true }
      );

      // If another request already marked it paid, do not decrement stock again
      if (!updatedOrder) {
        return res.status(200).json({
          success: true,
          message: 'Demo payment already confirmed.',
          orderId: order._id,
          orderNumber: order.orderNumber,
          transactionId: order.payment.transactionId || order.payment.razorpayPaymentId,
          alreadyVerified: true,
        });
      }

      // Decrement stock only once
      for (const item of updatedOrder.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Demo payment simulated successfully and stock updated.',
        orderId: updatedOrder._id,
        orderNumber: updatedOrder.orderNumber,
        transactionId: demoTxnId,
        isDemo: true,
      });
    } else {
      // Simulated Payment Failure
      order.payment.status = 'failed';
      order.payment.failureReason = failureReason || 'Payment declined in demo simulation.';
      await order.save();

      // Zero stock deduction on failure
      return res.status(200).json({
        success: false,
        message: 'Demo payment simulation failed as requested. No stock was deducted.',
        orderId: order._id,
        orderNumber: order.orderNumber,
        isDemo: true,
      });
    }
  } catch (error) {
    next(error);
  }
};
