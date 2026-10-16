import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../services/api';
import { Spinner } from '../components/common/Loader';
import {
  Package,
  Search,
  Calendar,
  CreditCard,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = async (email = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrders(email);
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrders(searchEmail.trim());
  };

  const getStatusBadge = (status, paymentStatus) => {
    if (paymentStatus === 'paid') {
      return <span className="badge badge-success">Paid &bull; {status}</span>;
    }
    if (paymentStatus === 'failed') {
      return <span className="badge badge-danger">Payment Failed</span>;
    }
    return <span className="badge badge-warning">{paymentStatus || 'Pending'}</span>;
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem', maxWidth: '940px' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 className="title-section" style={{ marginBottom: '0.25rem' }}>
            Order History & Tracking
          </h1>
          <p className="text-muted">Lookup placed orders and view payment transaction details</p>
        </div>

        {/* Search by Customer Email */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '340px' }}>
          <input
            type="email"
            placeholder="Search by customer email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="form-input"
            style={{ fontSize: '0.85rem' }}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            <Search size={16} />
          </button>
        </form>
      </div>

      {loading ? (
        <Spinner message="Retrieving order records..." />
      ) : error ? (
        <div
          style={{
            padding: '2rem',
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '4rem 1rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              color: 'var(--text-muted)',
            }}
          >
            <Package size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No orders found
          </h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
            {searchEmail
              ? `No orders found for "${searchEmail}". Try another email address.`
              : 'You haven’t placed any orders yet. Complete a test purchase to see it here!'}
          </p>
          <Link to="/products" className="btn btn-primary">
            Explore Products Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => (
            <div
              key={order._id}
              className="card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {/* Order Header */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--secondary)' }}>
                      {order.orderNumber}
                    </span>
                    {getStatusBadge(order.orderStatus, order.payment?.status)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })} &bull; {order.shippingAddress?.email}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{order.pricing?.grandTotal?.toLocaleString('en-IN')}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.9rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={item.image}
                        alt=""
                        style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                      />
                      <span>
                        <strong>{item.name}</strong> &times; {item.quantity}
                      </span>
                    </div>
                    <span style={{ fontWeight: 600 }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer & Action */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f1f5f9',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CreditCard size={14} />
                  <span>
                    Payment ID:{' '}
                    <code>{order.payment?.razorpayPaymentId || order.payment?.razorpayOrderId || 'Pending'}</code>
                  </span>
                </div>

                <Link
                  to={`/order/success/${order._id}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: 'var(--primary)',
                    fontWeight: 600,
                  }}
                >
                  View Full Receipt <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
