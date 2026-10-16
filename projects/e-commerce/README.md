# AeroTech E-Commerce Platform with Razorpay Test Mode

A complete, production-style e-commerce platform built with **React (Vite)**, **Node.js (Express ES Modules)**, **MongoDB (Mongoose)**, and **Razorpay Test Mode** payment integration.

---

## 🌟 Key Features

1. **Modern Catalog & Home Experience**:
   - Hero banner with quick navigation.
   - Dynamic product category filtering and sorting (Price low/high, newest, customer ratings).
   - Instant text search across title, description, and categories.
2. **Product Details & Gallery**:
   - Multi-image zoom gallery.
   - Comprehensive technical specifications and bullet-point features.
   - Real-time stock status and quantity picker.
   - Direct "Buy Now" and "Add to Cart" triggers.
3. **Shopping Cart**:
   - Persistent cart state across sessions using `localStorage`.
   - Real-time quantity adjustments and item removal.
   - Free shipping progress bar (Free delivery above ₹1,500).
   - Subtotal, 18% GST, and grand total recalculation.
4. **Secure Checkout & Razorpay Test Mode**:
   - Customer shipping address validation.
   - Server-side price recalculation (client prices are never trusted).
   - Razorpay Order creation on the server.
   - Official Razorpay Checkout Modal integration.
   - **HMAC-SHA256 signature verification** on the backend using `RAZORPAY_KEY_SECRET`.
   - Immediate stock deduction upon confirmed payment.
5. **Post-Purchase & Order History**:
   - Invoice receipt with order number and Razorpay payment ID.
   - Printable order confirmation.
   - Order history lookup filterable by customer email.

---
