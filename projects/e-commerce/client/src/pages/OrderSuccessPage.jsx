import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderDetails } from '../services/api';
import { Spinner } from '../components/common/Loader';
import {
  CheckCircle,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  ArrowRight,
  Printer,
  ShieldCheck,
} from 'lucide-react';

export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const data = await fetchOrderDetails(orderId);
        setOrder(data.order);
      } catch (err) {
        setError(err.message || 'Order could not be loaded');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  if (loading) {
    return <Spinner message="Fetching confirmed order details..." />;
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--danger)' }}>
          {error || 'Order Not Found'}
        </h2>
        <Link to="/products" className="btn btn-primary">
          Return to Store
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '840px' }}>
      {/* Success Hero Card */}
      <div
        className="card"
        style={{
          padding: '2.5rem 2rem',
          textAlign: 'center',
          marginBottom: '2rem',
          borderTop: '6px solid var(--success)',
        }}
      >
        <div
          style={{
            width: '4.5rem',
            height: '4.5rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--success-bg)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
          }}
        >
          <CheckCircle size={44} />
        </div>

        <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>
          Payment Verified &bull; Test Mode
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--secondary)',
            marginBottom: '0.5rem',
          }}
        >
          Thank You For Your Order!
        </h1>

        <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
          Your payment was processed successfully. A confirmation email has been sent to{' '}
          <strong>{order.shippingAddress?.email}</strong>.
        </p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1.5rem',
            background: '#f8fafc',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>ORDER NUMBER</span>
            <strong style={{ color: 'var(--secondary)' }}>{order.orderNumber}</strong>
          </div>
          <div style={{ height: '30px', width: '1px', background: 'var(--border-color)' }} />
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>PAYMENT ID</span>
            <code style={{ color: 'var(--primary)', fontWeight: 700 }}>
              {order.payment?.razorpayPaymentId || 'rzp_test_success'}
            </code>
          </div>
        </div>
      </div>

      {/* Invoice Details Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)' }}>
            Order Items & Receipt
          </h2>
          <button
            type="button"
            onClick={handlePrint}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Printer size={14} /> Print Receipt
          </button>
        </div>

        {/* Item Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={item.image || 'https://via.placeholder.com/80'}
                  alt={item.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} &times; ₹{item.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        {/* Cost Breakdown */}
        <div
          style={{
            background: '#f8fafc',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-muted">Items Subtotal</span>
            <span>₹{order.pricing?.itemsTotal?.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-muted">Shipping</span>
            <span>
              {order.pricing?.shippingFee === 0 ? (
                <strong style={{ color: 'var(--success)' }}>FREE</strong>
              ) : (
                `₹${order.pricing?.shippingFee}`
              )}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-muted">GST Tax (18%)</span>
            <span>₹{order.pricing?.tax?.toLocaleString('en-IN')}</span>
          </div>
          <div
            style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '0.75rem',
              marginTop: '0.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <strong style={{ fontSize: '1.05rem' }}>Total Amount Paid</strong>
            <strong style={{ fontSize: '1.35rem', color: 'var(--primary)' }}>
              ₹{order.pricing?.grandTotal?.toLocaleString('en-IN')}
            </strong>
          </div>
        </div>

        {/* Shipping Address */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={16} color="var(--primary)" /> Delivery Address
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <strong>{order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.phone})<br />
            {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}<br />
            {order.shippingAddress?.country}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link to="/products" className="btn btn-primary btn-lg">
          Continue Shopping <ArrowRight size={18} />
        </Link>
        <Link to="/orders" className="btn btn-secondary btn-lg">
          View All Orders
        </Link>
      </div>
    </div>
  );
};
