import React, { useState } from 'react';
import { CreditCard, HelpCircle, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export const RazorpayTestHelper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div
      style={{
        background: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.5rem',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#0369a1',
          fontWeight: 600,
          fontSize: '0.9rem',
          textAlign: 'left',
          background: 'none',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CreditCard size={18} />
          Razorpay Test Mode Helper & Credentials
        </span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', fontSize: '0.875rem', color: '#0c4a6e' }}>
          <p style={{ marginBottom: '0.75rem', lineHeight: 1.4 }}>
            Use these test details in the Razorpay Checkout popup to simulate real transactions safely:
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem',
              background: '#ffffff',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #e0f2fe',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>TEST CARD NUMBER</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  4111 1111 1111 1111
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard('4111111111111111', 'card')}
                  title="Copy card number"
                  style={{ color: '#0284c7' }}
                >
                  {copiedField === 'card' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>EXPIRY & CVV</div>
              <div style={{ marginTop: '0.2rem', fontWeight: 600 }}>
                Any future date (e.g. <code>12/28</code>) / <code>123</code>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>TEST UPI ID</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  success@razorpay
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard('success@razorpay', 'upi')}
                  title="Copy UPI ID"
                  style={{ color: '#0284c7' }}
                >
                  {copiedField === 'upi' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>OTP (FOR SMS/3DS)</div>
              <div style={{ marginTop: '0.2rem', fontWeight: 600 }}>
                <code>123456</code> (or click "Success" in modal)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
