import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import {
  ShoppingBag,
  Search,
  Package,
  Layers,
  Menu,
  X,
  CreditCard,
} from 'lucide-react';

export const Navbar = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon">
            <ShoppingBag size={20} />
          </div>
          <span>Aero<span style={{ color: 'var(--primary)' }}>Tech</span></span>
        </Link>

        {/* Global Search Bar (Desktop) */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            maxWidth: '380px',
            width: '100%',
          }}
          className="search-form-desktop"
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search premium headphones, monitors, watches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 1rem 0.55rem 2.4rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              background: '#f8fafc',
              fontSize: '0.875rem',
            }}
          />
        </form>

        {/* Nav Links */}
        <nav className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
          >
            Products
          </Link>
          <Link
            to="/orders"
            className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}
          >
            My Orders
          </Link>
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          <Link to="/cart" className="cart-btn" aria-label="Shopping Cart">
            <ShoppingBag size={20} />
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', padding: '0.4rem', color: 'var(--text-main)' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#ffffff',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 1.5rem',
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600, padding: '0.5rem 0' }}
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600, padding: '0.5rem 0' }}
            >
              All Products
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600, padding: '0.5rem 0' }}
            >
              Order History & Lookup
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .search-form-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
};
