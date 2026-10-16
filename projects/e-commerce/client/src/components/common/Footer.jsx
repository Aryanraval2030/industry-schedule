import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Headphones, Lock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Value Prop Banner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '2.5rem',
            marginBottom: '2.5rem',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: '#38bdf8' }}><Truck size={28} /></div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem' }}>Free Fast Shipping</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>On all orders above ₹1,500</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: '#38bdf8' }}><ShieldCheck size={28} /></div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem' }}>1-Year Brand Warranty</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>100% genuine guaranteed</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: '#38bdf8' }}><Lock size={28} /></div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem' }}>Razorpay Secure</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>256-Bit SSL Encrypted checkout</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: '#38bdf8' }}><Headphones size={28} /></div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem' }}>Dedicated Support</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Expert assistance 7 days a week</div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>AeroTech</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '300px' }}>
              Engineered for audiophiles, creators, and professionals. Experience cutting-edge consumer tech with seamless Razorpay payments.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <div className="razorpay-badge">
                <Lock size={14} />
                <span>Verified Razorpay Integration</span>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/products?category=Audio">Audio & Headphones</Link></li>
              <li><Link to="/products?category=Electronics">Monitors & Gear</Link></li>
              <li><Link to="/products?category=Wearables">Smart Watches</Link></li>
              <li><Link to="/products?category=Accessories">Accessories</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Customer Support</h4>
            <ul>
              <li><Link to="/orders">Track Your Order</Link></li>
              <li><Link to="/cart">Shopping Bag</Link></li>
              <li><a href="#support">Shipping Policy</a></li>
              <li><a href="#terms">Terms & Refund Policy</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Payment Security</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Integrated with Razorpay Test Mode. All transactions are securely verified via HMAC-SHA256 signatures on the backend.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8' }}>
              Test Mode Active &bull; UPI &bull; Cards &bull; NetBanking
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>&copy; {new Date().getFullYear()} AeroTech Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Built with React + Vite + Node.js + Express + Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
