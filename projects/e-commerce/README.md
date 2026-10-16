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

## 📁 Project Structure

```
e-commerce/
├── package.json              # Root runner scripts (npm run dev, build, etc.)
├── server/                   # Backend Node.js + Express (ES Modules)
│   ├── .env                  # Port, Mongo URI, Razorpay credentials
│   ├── .env.example
│   └── src/
│       ├── config/           # MongoDB and Razorpay client setup
│       ├── controllers/      # Product, Payment & Order logic
│       ├── models/           # Mongoose Product and Order schemas
│       ├── routes/           # Express REST endpoints
│       ├── middleware/       # Error handling
│       ├── seed/             # Sample catalog seeder
│       └── app.js            # Express server entry point
└── client/                   # Frontend React + Vite
    ├── index.html            # Loads Razorpay Checkout SDK
    ├── src/
    │   ├── components/       # Navbar, Footer, ProductCard, TestHelper, Toast
    │   ├── context/          # CartContext (State, Totals & Persistence)
    │   ├── pages/            # Home, Products, Detail, Cart, Checkout, Success, Orders
    │   ├── services/         # API fetch wrappers & Razorpay launcher
    │   └── styles/           # CSS design system
    └── vite.config.js
```

---

## 🚀 Quick Start Guide

### 1. Configure Razorpay Test Mode Credentials
Open `server/.env` and insert your Razorpay Test API keys:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
RAZORPAY_KEY_SECRET=YourKeySecretHere
CLIENT_URL=http://localhost:5173
```

> **How to get Razorpay Test Keys:**
> 1. Sign up / Log in to [dashboard.razorpay.com](https://dashboard.razorpay.com).
> 2. Switch the top toggle to **Test Mode**.
> 3. Navigate to **Settings** &rarr; **API Keys** &rarr; **Generate Test Key**.
> 4. Copy `Key Id` into `RAZORPAY_KEY_ID` and `Key Secret` into `RAZORPAY_KEY_SECRET`.

### 2. Start Developing
Run from the root directory:
```bash
# Start both backend server and frontend client concurrently
npm run dev
```

Or run them individually in separate terminals:
```bash
# Terminal 1: Backend (Port 5000)
npm run server

# Terminal 2: Frontend (Port 5173)
npm run client
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 💳 Razorpay Test Mode Payment Credentials

When checking out, test payments can be made using these credentials:

| Field | Value |
| :--- | :--- |
| **Card Number** | `4111 1111 1111 1111` (or any valid test card) |
| **Expiry Date** | Any future date (e.g., `12/28`) |
| **CVV** | Any 3 digits (e.g., `123`) |
| **OTP** | `123456` (or click "Success" in test dialog) |
| **UPI ID** | `success@razorpay` |

---

## 🔒 Security Highlights

- **Server-Side Authoritative Pricing**: Product prices are re-queried from MongoDB before creating a Razorpay order. The client cannot manipulate item prices.
- **Key Isolation**: The `RAZORPAY_KEY_SECRET` resides strictly on the backend and is never sent to the client.
- **HMAC SHA-256 Verification**: Upon payment callback, the backend validates that:
  $$\text{HMAC-SHA256}(\text{order\_id} + "|" + \text{payment\_id},\; \text{SECRET}) == \text{signature}$$
  Orders are confirmed and inventory deducted only if this signature matches.
