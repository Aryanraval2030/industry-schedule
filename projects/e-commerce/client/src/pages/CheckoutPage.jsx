import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  createRazorpayOrder,
  verifyPaymentSignature,
  notifyPaymentFailure,
} from '../services/api';
import { launchRazorpayCheckout } from '../services/razorpay';
import { RazorpayTestHelper } from '../components/common/RazorpayTestHelper';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const CheckoutPage = () => {
  const { cartItems, totalItems, subtotal, shippingFee, tax, grandTotal, clearCart, showToast } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '9876543210',
    address: 'Flat 402, Skyline Residency, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400050',
    country: 'India',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [generalError, setGeneralError] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          Your cart is empty
        </h2>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Valid Email Address is required';
    }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      errors.phone = '10-digit mobile number is required';
    }
    if (!formData.address.trim()) errors.address = 'Street Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.postalCode.trim() || formData.postalCode.length < 5) {
      errors.postalCode = 'Valid Postal / PIN Code is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      showToast('Please correct the validation errors in the delivery form.', 'warning');
      return;
    }

    try {
      setIsProcessing(true);

      // Step 1: Create Order on backend (server calculates authoritative price & creates Razorpay order)
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.product || item._id,
          quantity: item.quantity,
        })),
        shippingAddress: formData,
      };

      const serverOrderData = await createRazorpayOrder(orderPayload);

      const {
        orderId,
        orderNumber,
        razorpayOrderId,
        amount,
        currency,
        keyId,
      } = serverOrderData;

      if (!keyId || keyId.includes('placeholder')) {
        setGeneralError(
          'Razorpay Test Key is not configured in backend server/.env. Please set valid RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
        );
        setIsProcessing(false);
        return;
      }

      // Step 2: Launch the Razorpay Checkout Modal
      await launchRazorpayCheckout({
        key: keyId,
        amount,
        currency: currency || 'INR',
        orderId: razorpayOrderId,
        name: 'AeroTech Electronics',
        description: `Order #${orderNumber}`,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
          address: `${formData.address}, ${formData.city}`,
        },
        onSuccess: async (razorpayResponse) => {
          try {
            // Step 3: Send payment details and HMAC signature to backend for cryptographic verification
            const verifyPayload = {
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
              orderId,
            };

            const verificationResult = await verifyPaymentSignature(verifyPayload);

            if (verificationResult.success) {
              clearCart();
              navigate(`/order/success/${orderId}`);
            } else {
              navigate(
                `/order/failed?orderId=${orderId}&reason=${encodeURIComponent(
                  verificationResult.message || 'Payment signature verification failed'
                )}`
              );
            }
          } catch (verifyErr) {
            console.error('Verification error:', verifyErr);
            navigate(
              `/order/failed?orderId=${orderId}&reason=${encodeURIComponent(
                verifyErr.message || 'Failed to verify payment signature'
              )}`
            );
          } finally {
            setIsProcessing(false);
          }
        },
        onDismiss: async () => {
          setIsProcessing(false);
          showToast('Payment window was closed without completing payment.', 'info');
          try {
            await notifyPaymentFailure({
              orderId,
              razorpay_order_id: razorpayOrderId,
              reason: 'Customer dismissed Razorpay checkout window',
            });
          } catch (e) {
            console.warn('Could not notify cancellation:', e.message);
          }
        },
        onFailure: async (errorObj) => {
          setIsProcessing(false);
          try {
            await notifyPaymentFailure({
              orderId,
              razorpay_order_id: razorpayOrderId,
              reason: errorObj.description || 'Payment gateway declined transaction',
            });
          } catch (e) {
            console.warn('Could not record failure:', e.message);
          }
          navigate(
            `/order/failed?orderId=${orderId}&reason=${encodeURIComponent(
              errorObj.description || 'Payment declined by Razorpay'
            )}`
          );
        },
      });
    } catch (err) {
      console.error('Checkout initiation failed:', err);
      setGeneralError(err.message || 'Failed to initialize payment order with server.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/cart"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Shopping Cart
        </Link>
        <h1 className="title-section" style={{ marginBottom: '0.25rem' }}>
          Secure Checkout
        </h1>
        <p className="text-muted">Enter delivery details and proceed with Razorpay Test Mode</p>
      </div>

      {/* Razorpay Test Mode Helper Accordion */}
      <RazorpayTestHelper />

      {generalError && (
        <div
          style={{
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <AlertTriangle size={20} />
          <span>{generalError}</span>
        </div>
      )}

      {/* Checkout Layout */}
      <form onSubmit={handleProceedToPayment}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Customer & Delivery Details */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--secondary)' }}>
              1. Customer Delivery Details
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. Rahul Sharma"
                />
                {formErrors.fullName && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{formErrors.fullName}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="name@example.com"
                />
                {formErrors.email && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{formErrors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="10-digit number"
                />
                {formErrors.phone && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{formErrors.phone}</span>
                )}
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="House / Flat No., Building, Street Name"
                />
                {formErrors.address && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{formErrors.address}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="City"
                />
                {formErrors.city && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{formErrors.city}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="State"
                />
                {formErrors.state && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{formErrors.state}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">PIN / Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. 400050"
                />
                {formErrors.postalCode && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{formErrors.postalCode}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  disabled
                  className="form-input"
                  style={{ background: '#f8fafc', color: 'var(--text-muted)' }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Razorpay Action */}
          <div
            className="card"
            style={{
              padding: '2rem',
              background: '#ffffff',
              position: 'sticky',
              top: '5.5rem',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--secondary)' }}>
              2. Order Summary
            </h2>

            {/* Itemized preview */}
            <div
              style={{
                maxHeight: '220px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginBottom: '1.25rem',
                paddingRight: '0.5rem',
              }}
            >
              {cartItems.map((item) => (
                <div
                  key={item.product || item._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.9rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <img
                      src={item.image}
                      alt=""
                      style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, maxWidth: '170px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontWeight: 600 }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div
              style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Subtotal ({totalItems} items)</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Shipping Fee</span>
                <span>{shippingFee === 0 ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span> : `₹${shippingFee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Taxes (18% GST)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Payable</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="btn btn-primary btn-block btn-lg"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Processing Order...
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  Pay ₹{grandTotal.toLocaleString('en-IN')} with Razorpay
                </>
              )}
            </button>

            <div
              style={{
                marginTop: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}
            >
              <Lock size={14} color="var(--success)" />
              <span>Razorpay Test Mode &bull; HMAC Signature Verified</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
