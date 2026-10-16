import React from 'react';
import { useCart } from '../../context/CartContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toasts, removeToast } = useCart();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let icon = <Info size={18} color="#38bdf8" />;
        let borderColor = '#38bdf8';

        if (toast.type === 'success') {
          icon = <CheckCircle2 size={18} color="#34d399" />;
          borderColor = '#34d399';
        } else if (toast.type === 'warning' || toast.type === 'error') {
          icon = <AlertCircle size={18} color="#f87171" />;
          borderColor = '#f87171';
        }

        return (
          <div
            key={toast.id}
            className="toast"
            style={{ borderLeft: `4px solid ${borderColor}` }}
          >
            {icon}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ color: '#94a3b8', display: 'flex' }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
