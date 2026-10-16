import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw, ShoppingCart, HelpCircle } from 'lucide-react';

export const OrderFailurePage = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'Transaction was declined or cancelled.';
  const orderId = searchParams.get('orderId');

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '640px' }}>
      <div
        className="card"
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          borderTop: '6px solid var(--danger)',
        }}
      >
        <div
          style={{
            width: '4.5rem',
            height: '4.5rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
          }}
        >
          <XCircle size={44} />
        </div>

        <span className="badge badge-danger" style={{ marginBottom: '0.75rem' }}>
          Payment Incomplete
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.85rem',
            fontWeight: 700,
            color: 'var(--secondary)',
            marginBottom: '0.75rem',
          }}
        >
          Payment Was Not Completed
        </h1>

        <div
          style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#9f1239',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            marginBottom: '1.75rem',
            textAlign: 'left',
          }}
        >
          <strong>Reason: </strong> {reason}
        </div>

        <p className="text-muted" style={{ fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.5 }}>
          No funds were debited. If this was intentional, you can review your cart items and try again whenever you are ready.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/checkout" className="btn btn-primary btn-lg">
            <RefreshCw size={18} /> Retry Payment
          </Link>
          <Link to="/cart" className="btn btn-secondary btn-lg">
            <ShoppingCart size={18} /> Review Cart
          </Link>
        </div>

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <HelpCircle size={16} />
          <span>Need help with test payments? Use card <code>4111 1111 1111 1111</code> and OTP <code>123456</code>.</span>
        </div>
      </div>
    </div>
  );
};
