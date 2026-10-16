import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductDetails } from '../services/api';
import { useCart } from '../context/CartContext';
import { Spinner } from '../components/common/Loader';
import {
  Star,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductDetails(slug);
        setProduct(data.product);
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return <Spinner message="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--danger)' }}>
          {error || 'Product not found'}
        </h2>
        <Link to="/products" className="btn btn-primary">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleQuantityChange = (change) => {
    const newQty = quantity + change;
    if (newQty >= 1 && newQty <= (product.stock || 10)) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      {/* Breadcrumb */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '2rem',
        }}
      >
        <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to="/products" style={{ color: 'var(--text-muted)' }}>Products</Link>
        <ChevronRight size={14} />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} style={{ color: 'var(--text-muted)' }}>
          {product.category}
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product.name}</span>
      </nav>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem',
        }}
      >
        {/* Left: Image Gallery */}
        <div>
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              height: '420px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '2px solid',
                    borderColor: selectedImage === idx ? 'var(--primary)' : 'var(--border-color)',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Buy Box */}
        <div>
          <div className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
            {product.category}
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 700,
              lineHeight: 1.25,
              color: 'var(--secondary)',
              marginBottom: '0.75rem',
            }}
          >
            {product.name}
          </h1>

          {/* Ratings */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                background: '#fef3c7',
                color: '#b45309',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              <Star size={14} fill="#b45309" />
              {product.rating}
            </div>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              ({product.reviewsCount} customer reviews)
            </span>
          </div>

          {/* Price Box */}
          <div
            style={{
              padding: '1.25rem',
              background: '#f8fafc',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: '1.1rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent && (
                <span className="badge badge-danger" style={{ fontSize: '0.8rem' }}>
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Inclusive of all taxes &bull; Free standard shipping on this order
            </div>
          </div>

          {/* Stock Status */}
          <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <span style={{ fontWeight: 600 }}>Availability: </span>
            {product.stock > 0 ? (
              <span style={{ color: 'var(--success)', fontWeight: 700 }}>
                In Stock ({product.stock} units ready to ship)
              </span>
            ) : (
              <span style={{ color: 'var(--danger)', fontWeight: 700 }}>Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector & Actions */}
          {product.stock > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Quantity:</span>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    background: '#ffffff',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    style={{ padding: '0.5rem 0.75rem', color: 'var(--text-main)' }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ width: '40px', textAlign: 'center', fontWeight: 700 }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    style={{ padding: '0.5rem 0.75rem', color: 'var(--text-main)' }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn btn-secondary btn-lg"
                  style={{ flex: 1, minWidth: '160px' }}
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1, minWidth: '160px' }}
                >
                  <Zap size={18} /> Buy Now
                </button>
              </div>
            </div>
          )}

          {/* Value props */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <ShieldCheck size={18} color="var(--primary)" />
              <span>1 Year Warranty</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Truck size={18} color="var(--primary)" />
              <span>Free Delivery Above ₹1,500</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <RotateCcw size={18} color="var(--primary)" />
              <span>7 Days Return Window</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Check size={18} color="var(--primary)" />
              <span>Razorpay Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specs Tabs */}
      <div
        className="card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--secondary)' }}>
          Product Description
        </h2>
        <p style={{ lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
          {product.description}
        </p>

        {/* Feature Highlights */}
        {product.features && product.features.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Key Features
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {product.features.map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specs Table */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Technical Specifications
            </h3>
            <div
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}
            >
              {Object.entries(product.specs).map(([key, val], idx) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    padding: '0.75rem 1rem',
                    background: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                    borderBottom: idx === Object.entries(product.specs).length - 1 ? 'none' : '1px solid var(--border-color)',
                  }}
                >
                  <span style={{ width: '40%', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {key}
                  </span>
                  <span style={{ width: '60%', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
