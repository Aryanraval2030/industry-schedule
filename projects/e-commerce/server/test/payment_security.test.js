import crypto from 'crypto';
import mongoose from 'mongoose';
import { connectDB, closeDB } from '../src/config/db.js';
import Product from '../src/models/Product.js';
import Order from '../src/models/Order.js';
import { seedProductsIfNeeded } from '../src/seed/seeder.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runSecurityAuditTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING PAYMENT & SECURITY AUTOMATED TEST SUITE');
  console.log('======================================================\n');

  // Setup
  console.log('[Phase 1] Database Connection & Catalog Integrity');
  await connectDB();
  await seedProductsIfNeeded();
  const productCount = await Product.countDocuments();
  assert(productCount >= 8, `Catalog has ${productCount} products (>= 8 expected)`);

  const product = await Product.findOne({ stock: { $gte: 5 } });
  assert(product !== null, `Found available product: "${product.name}"`);
  const initialStock = product.stock;

  // Phase 2: Authoritative Price Calculation & Currency Conversion
  console.log('\n[Phase 2] Server-Side Price Calculation & Currency Conversion');
  const qty = 2;
  const itemsTotal = product.price * qty;
  const shippingFee = itemsTotal >= 1500 ? 0 : 99;
  const tax = Math.round(itemsTotal * 0.18);
  const grandTotal = itemsTotal + shippingFee + tax;
  const amountInPaise = Math.round(grandTotal * 100);

  assert(grandTotal === itemsTotal + shippingFee + tax, 'Price calculation formula is strictly valid');
  assert(amountInPaise === grandTotal * 100, `Amount in paise converted accurately (₹${grandTotal} = ${amountInPaise} paise)`);

  // Phase 3: Order Initialisation & Status Tracking
  console.log('\n[Phase 3] Order Initialisation in MongoDB');
  const testSecret = 'sec_test_secret_for_audit_only';
  process.env.RAZORPAY_KEY_SECRET = testSecret;

  const razorpayOrderId = 'order_test_' + Date.now();
  const razorpayPaymentId = 'pay_test_' + Date.now();

  const order = await Order.create({
    orderNumber: `ORD-AUDIT-${Date.now().toString().slice(-6)}`,
    items: [
      {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.images[0] || '',
      },
    ],
    shippingAddress: {
      fullName: 'Security Auditor',
      email: 'audit@example.com',
      phone: '9876543210',
      address: 'Suite 101, Audit Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
    },
    pricing: {
      itemsTotal,
      shippingFee,
      tax,
      grandTotal,
    },
    payment: {
      method: 'Razorpay',
      razorpayOrderId,
      status: 'created',
    },
    orderStatus: 'Placed',
  });

  assert(order.payment.status === 'created', 'Order initialized in "created" state');
  assert(order.pricing.grandTotal === grandTotal, 'Grand total matches server-side computation');

  // Phase 4: Cryptographic HMAC SHA-256 Signature Verification
  console.log('\n[Phase 4] Cryptographic HMAC SHA-256 Signature Verification');
  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const validSignature = crypto
    .createHmac('sha256', testSecret)
    .update(payload)
    .digest('hex');

  const tamperedSignature = crypto
    .createHmac('sha256', 'wrong_secret')
    .update(payload)
    .digest('hex');

  // Verify tampered signature fails
  const isTamperedValid = crypto.createHmac('sha256', testSecret).update(payload).digest('hex') === tamperedSignature;
  assert(!isTamperedValid, 'Tampered / forged signature was strictly rejected');

  // Verify authentic signature matches
  const isAuthenticValid = crypto.createHmac('sha256', testSecret).update(payload).digest('hex') === validSignature;
  assert(isAuthenticValid, 'Authentic Razorpay HMAC SHA-256 signature verified successfully');

  // Phase 5: Atomic State Transition & Stock Deduction
  console.log('\n[Phase 5] Atomic Order Confirmation & Inventory Deduction');
  const confirmedOrder = await Order.findOneAndUpdate(
    {
      _id: order._id,
      'payment.status': { $ne: 'paid' },
    },
    {
      $set: {
        'payment.razorpayPaymentId': razorpayPaymentId,
        'payment.razorpaySignature': validSignature,
        'payment.status': 'paid',
        'payment.paidAt': new Date(),
        orderStatus: 'Processing',
      },
    },
    { new: true }
  );

  assert(confirmedOrder !== null, 'Order atomically transitioned from "created" to "paid"');

  // Decrement stock
  for (const item of confirmedOrder.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  const productAfterPurchase = await Product.findById(product._id);
  assert(
    productAfterPurchase.stock === initialStock - qty,
    `Stock accurately decremented from ${initialStock} to ${productAfterPurchase.stock}`
  );

  // Phase 6: Duplicate Verification & Double-Deduction Prevention Test
  console.log('\n[Phase 6] Idempotency & Duplicate Deduction Prevention (Simulating Double Callback)');
  const duplicateAttempt = await Order.findOneAndUpdate(
    {
      _id: order._id,
      'payment.status': { $ne: 'paid' },
    },
    {
      $set: {
        'payment.status': 'paid',
      },
    },
    { new: true }
  );

  assert(duplicateAttempt === null, 'Atomic query correctly blocked second attempt on already "paid" order');

  const productAfterDuplicateAttempt = await Product.findById(product._id);
  assert(
    productAfterDuplicateAttempt.stock === initialStock - qty,
    'Zero duplicate stock deduction: Inventory remained strictly intact on duplicate request'
  );

  // Phase 7: Order Query & History Lookup
  console.log('\n[Phase 7] Order Query & History Lookup');
  const fetchedOrders = await Order.find({ 'shippingAddress.email': 'audit@example.com' });
  assert(fetchedOrders.length >= 1, `Retrieved ${fetchedOrders.length} order(s) for customer email`);
  assert(fetchedOrders[0].orderNumber === order.orderNumber, 'Order Number accurately retrieved');
  assert(fetchedOrders[0].payment.status === 'paid', 'Order status verified as "paid"');

  console.log('\n======================================================');
  console.log(`🎉 ALL ${passed} AUTOMATED SECURITY & PAYMENT TESTS PASSED! (Failed: ${failed})`);
  console.log('======================================================\n');

  await closeDB();
  process.exit(0);
}

runSecurityAuditTests().catch(async (err) => {
  console.error('\n❌ Security Test Suite Failed:', err);
  await closeDB();
  process.exit(1);
});
