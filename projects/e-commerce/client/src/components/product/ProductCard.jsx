import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Star, ShoppingCart, Check } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();

  const isInCart = cartItems.some(
    (item) => item.product === product._id || item._id === product._id
  );

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="card product-card">
      <Link to={`/products/${product.slug}`} className="product-image-wrap">
        <img
          src={product.images[0] || 'https://via.placeholder.com/600x400?text=No+Image'}
          alt={product.name}
          loading="lazy"
        />
        <span className="product-category-tag">{product.category}</span>
        {discountPercent && (
          <span
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: '#ef4444',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {discountPercent}% OFF
          </span>
        )}
      </Link>

      <div className="product-body">
        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#f59e0b' }}>
            <Star size={14} fill="#f59e0b" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, marginLeft: '0.25rem', color: 'var(--text-main)' }}>
              {product.rating || 4.5}
            </span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ({product.reviewsCount || 42})
          </span>
        </div>

        {/* Title */}
        <Link to={`/products/${product.slug}`}>
          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>
        </Link>

        {/* Stock info */}
        <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', marginBottom: '0.75rem' }}>
          {product.stock > 0 ? (
            <span style={{ color: product.stock < 5 ? '#f59e0b' : '#10b981', fontWeight: 600 }}>
              {product.stock < 5 ? `Only ${product.stock} left in stock` : 'In Stock'}
            </span>
          ) : (
            <span style={{ color: '#ef4444', fontWeight: 600 }}>Out of Stock</span>
          )}
        </div>

        {/* Price & Action */}
        <div className="product-price-row">
          <div>
            <span className="price-current">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="price-original" style={{ marginLeft: '0.5rem' }}>
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            type="button"
            className={`btn ${isInCart ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            style={{ marginLeft: 'auto' }}
            disabled={product.stock <= 0}
            onClick={() => addToCart(product, 1)}
            aria-label={`Add ${product.name} to cart`}
          >
            {isInCart ? (
              <>
                <Check size={14} /> Added
              </>
            ) : (
              <>
                <ShoppingCart size={14} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
