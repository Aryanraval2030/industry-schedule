import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFeaturedProducts, fetchCategories } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { Spinner } from '../components/common/Loader';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Headphones,
  Monitor,
  Watch,
  ShoppingBag,
} from 'lucide-react';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [featData, catData] = await Promise.all([
          fetchFeaturedProducts(),
          fetchCategories(),
        ]);
        setFeaturedProducts(featData.products || []);
        setCategories(catData.categories || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const categoryIcons = {
    Audio: <Headphones size={24} />,
    Electronics: <Monitor size={24} />,
    Wearables: <Watch size={24} />,
    Accessories: <ShoppingBag size={24} />,
  };

  return (
    <div>
      {/* Hero Banner Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '4rem 0 5rem 0',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '3.5rem',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '640px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(37, 99, 235, 0.25)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                color: '#60a5fa',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
              }}
            >
              <Sparkles size={16} />
              Razorpay Test Mode Ready &bull; Next-Gen Gear
            </div>

            <h1
              className="title-hero"
              style={{ color: '#ffffff', marginBottom: '1.25rem' }}
            >
              Engineered For Audio & Visual Perfection.
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                color: '#94a3b8',
                lineHeight: 1.6,
                marginBottom: '2rem',
              }}
            >
              Discover high-performance headphones, crystal-clear 4K displays, and precision mechanical gear with instant test checkout.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Collection <ArrowRight size={18} />
              </Link>
              <Link to="/orders" className="btn btn-secondary btn-lg" style={{ background: '#334155', color: '#fff', borderColor: '#475569' }}>
                Track Orders
              </Link>
            </div>
          </div>
        </div>

        {/* Ambient decorative glow */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.3) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />
      </section>

      <div className="container">
        {/* Categories Section */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className="title-section">Explore By Category</h2>
            <p className="text-muted">Find exactly what matches your workflow and lifestyle</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="card"
                style={{
                  padding: '2rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '1rem',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {categoryIcons[cat] || <Zap size={24} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--secondary)' }}>
                    {cat}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Browse Catalog &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products Showcase */}
        <section style={{ marginBottom: '4rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
                HANDPICKED FOR YOU
              </div>
              <h2 className="title-section" style={{ marginBottom: 0 }}>
                Featured Gear
              </h2>
            </div>
            <Link
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              View all products &rarr;
            </Link>
          </div>

          {loading ? (
            <Spinner message="Loading featured products..." />
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
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.75rem',
              }}
            >
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Razorpay Integration Trust Banner */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
                SECURE CHECKOUT
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Powered by Razorpay Payment Gateway
              </h3>
              <p className="text-muted" style={{ lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Experience lightning-fast payments with support for Credit/Debit Cards, UPI, NetBanking, and Wallets. Every transaction is verified via cryptographic HMAC signatures on our Node.js server.
              </p>
              <Link to="/products" className="btn btn-primary">
                Try Test Purchase Now
              </Link>
            </div>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
              }}
            >
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--secondary)' }}>
                How Test Mode Works:
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--success)' }}>&bull;</span> No real money is ever deducted.
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--success)' }}>&bull;</span> Test card details are provided right on the checkout page.
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--success)' }}>&bull;</span> Server creates Razorpay order and securely verifies the signature.
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--success)' }}>&bull;</span> Generates invoice receipt and tracks order history in MongoDB.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
