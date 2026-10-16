import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';

export const CartPage = () => {
  const {
    cartItems,
    totalItems,
    subtotal,
    shippingFee,
    tax,
    grandTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <div
          style={{
            width: '4rem',
            height: '4rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            color: 'var(--text-muted)',
          }}
        >
          <ShoppingBag size={32} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--secondary)' }}>
          Your shopping cart is empty
        </h2>
        <p className="text-muted" style={{ marginBottom: '2rem', maxWidth: '420px', margin: '0 auto 2rem auto' }}>
          Looks like you haven't added anything to your cart yet. Explore our curated selection of high-performance gear.
        </p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Explore Products <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const freeShippingThreshold = 1500;
  const amountToFreeShipping = freeShippingThreshold - subtotal;

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}
      >
        <h1 className="title-section" style={{ marginBottom: 0 }}>
          Shopping Cart ({totalItems} items)
        </h1>
        <button
          type="button"
          onClick={clearCart}
          className="btn btn-secondary btn-sm"
          style={{ color: 'var(--danger)', borderColor: 'var(--border-color)' }}
        >
          Clear Cart
        </button>
      </div>

      {/* Free Shipping Alert Bar */}
      <div
        style={{
          background: subtotal >= freeShippingThreshold ? 'var(--success-bg)' : '#eff6ff',
          border: `1px solid ${subtotal >= freeShippingThreshold ? '#a7f3d0' : '#bfdbfe'}`,
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '2rem',
          fontSize: '0.9rem',
          color: subtotal >= freeShippingThreshold ? '#065f46' : '#1e40af',
        }}
      >
        <Truck size={20} />
        {subtotal >= freeShippingThreshold ? (
          <span style={{ fontWeight: 600 }}>
            🎉 You have qualified for Free Express Shipping!
          </span>
        ) : (
          <span>
            Add <strong>₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> more to your cart to qualify for <strong>FREE shipping</strong>!
          </span>
        )}
      </div>

      {/* Cart Grid: Items on Left, Summary on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.map((item) => (
            <div
              key={item.product || item._id}
              className="card"
              style={{
                display: 'flex',
                gap: '1.25rem',
                padding: '1.25rem',
                alignItems: 'center',
              }}
            >
              <img
                src={item.image || 'https://via.placeholder.com/100'}
                alt={item.name}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: 'var(--radius-md)',
                  objectFit: 'cover',
                  flexShrink: 0,
                  background: '#f1f5f9',
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <Link
                  to={`/products/${item.slug || item.product}`}
                  style={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--text-main)',
                    display: 'block',
                    marginBottom: '0.25rem',
                  }}
                >
                  {item.name}
                </Link>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  ₹{item.price.toLocaleString('en-IN')} each
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      background: '#ffffff',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product || item._id, item.quantity - 1)}
                      style={{ padding: '0.25rem 0.5rem', color: 'var(--text-main)' }}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ width: '32px', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product || item._id, item.quantity + 1)}
                      disabled={item.stock && item.quantity >= item.stock}
                      style={{ padding: '0.25rem 0.5rem', color: 'var(--text-main)' }}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product || item._id)}
                    style={{
                      color: 'var(--text-light)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.8rem',
                    }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Line Total */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary)' }}>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary Card */}
        <div
          className="card"
          style={{
            padding: '1.75rem',
            background: '#ffffff',
            position: 'sticky',
            top: '5.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--secondary)' }}>
            Order Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Subtotal ({totalItems} items)</span>
              <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Estimated Shipping</span>
              <span>
                {shippingFee === 0 ? (
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
                ) : (
                  `₹${shippingFee}`
                )}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Estimated GST (18%)</span>
              <span style={{ fontWeight: 600 }}>₹{tax.toLocaleString('en-IN')}</span>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1rem',
                marginTop: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Grand Total</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="btn btn-primary btn-block btn-lg"
            style={{ marginBottom: '1rem' }}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>

          <Link
            to="/products"
            className="btn btn-secondary btn-block"
            style={{ textAlign: 'center' }}
          >
            Continue Shopping
          </Link>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            <ShieldCheck size={16} color="var(--success)" />
            <span>Razorpay 256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
