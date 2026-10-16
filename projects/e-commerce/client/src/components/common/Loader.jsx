import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ message = 'Loading...', size = 32 }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        gap: '1rem',
        color: 'var(--text-muted)',
      }}
    >
      <Loader2
        size={size}
        className="spin"
        style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }}
      />
      <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{message}</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="card" style={{ height: '360px', opacity: 0.6, background: '#f1f5f9' }}>
      <div style={{ height: '60%', background: '#e2e8f0' }} />
      <div style={{ padding: '1rem' }}>
        <div style={{ height: '20px', background: '#cbd5e1', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ height: '14px', width: '60%', background: '#cbd5e1', borderRadius: '4px' }} />
      </div>
    </div>
  );
};
