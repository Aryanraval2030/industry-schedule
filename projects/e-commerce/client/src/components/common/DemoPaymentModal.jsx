import React from 'react';
import {
  CheckCircle2,
  XCircle,
  X,
  ShieldAlert,
  Loader2,
  CreditCard,
  ShoppingBag,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const DemoPaymentModal = ({
  isOpen,
  onClose,
  orderDetails,
  shippingAddress,
  onSimulateSuccess,
  onSimulateFailure,
  isProcessing,
  processingAction,
}) => {
  if (!isOpen || !orderDetails) return null;

  const { orderNumber, pricing, items } = orderDetails;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #cbd5e1',
          position: 'relative',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CreditCard size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--secondary)' }}>
                Demo Payment Gateway
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
                <span className="badge badge-warning" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                  SIMULATION MODE
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  No real funds involved
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            style={{
              padding: '0.35rem',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-muted)',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.5 : 1,
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Informational Callout */}
          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              fontSize: '0.85rem',
              color: '#1e40af',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
            }}
          >
            <Sparkles size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Learning & Test Environment:</strong> All pricing has been verified securely by the backend. Choose a scenario below to test the application's order and stock response.
            </div>
          </div>

          {/* Order Details Preview */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.1rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="text-muted">Order Number:</span>
              <strong style={{ color: 'var(--secondary)' }}>{orderNumber}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="text-muted">Customer:</span>
              <span>{shippingAddress?.fullName} ({shippingAddress?.email})</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="text-muted">Ship To:</span>
              <span style={{ textAlign: 'right', maxWidth: '240px' }}>
                {shippingAddress?.city}, {shippingAddress?.state} - {shippingAddress?.postalCode}
              </span>
            </div>

            {/* Line items summary */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', marginBottom: '0.75rem' }}>
              {items?.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  <span>{it.name} &times; {it.quantity}</span>
                  <span>₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Total Highlight */}
            <div
              style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Final Amount (Backend Verified):</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                ₹{pricing?.grandTotal?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action Simulation Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <button
              type="button"
              onClick={onSimulateSuccess}
              disabled={isProcessing}
              className="btn btn-primary btn-block btn-lg"
              style={{
                background: '#16a34a',
                borderColor: '#15803d',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                position: 'relative',
              }}
            >
              {isProcessing && processingAction === 'success' ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Confirming Order & Updating Stock...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Simulate Successful Payment
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onSimulateFailure}
              disabled={isProcessing}
              className="btn btn-block btn-lg"
              style={{
                background: '#fef2f2',
                border: '1.5px solid #f87171',
                color: '#dc2626',
                fontWeight: 600,
              }}
            >
              {isProcessing && processingAction === 'failure' ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Processing Simulated Failure...
                </>
              ) : (
                <>
                  <XCircle size={18} />
                  Simulate Failed Payment
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="btn btn-secondary btn-block btn-sm"
              style={{ marginTop: '0.25rem' }}
            >
              Cancel & Return to Checkout
            </button>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div
          style={{
            padding: '0.75rem 1.5rem',
            background: '#f8fafc',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          Protected against duplicate submissions &bull; Stock decrements only on success
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
