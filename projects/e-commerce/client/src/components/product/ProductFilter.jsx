import React from 'react';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';

export const ProductFilter = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
  priceRange,
  onChangePriceRange,
  onResetFilters,
}) => {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        marginBottom: '2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--secondary)' }}>
          <SlidersHorizontal size={18} color="var(--primary)" />
          <span>Filters & Categories</span>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <RotateCcw size={14} />
          Reset All
        </button>
      </div>

      {/* Categories Buttons */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          CATEGORIES
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => onSelectCategory('All')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: selectedCategory === 'All' ? 'var(--primary)' : 'var(--border-color)',
              backgroundColor: selectedCategory === 'All' ? 'var(--primary-light)' : '#ffffff',
              color: selectedCategory === 'All' ? 'var(--primary)' : 'var(--text-main)',
              transition: 'all 0.15s ease',
            }}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border-color)',
                backgroundColor: selectedCategory === cat ? 'var(--primary-light)' : '#ffffff',
                color: selectedCategory === cat ? 'var(--primary)' : 'var(--text-main)',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting & Price Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <div>
          <label className="form-label">Sort Products</label>
          <select
            value={selectedSort}
            onChange={(e) => onSelectSort(e.target.value)}
            className="form-select"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>

        <div>
          <label className="form-label">Price Range</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="number"
              placeholder="Min ₹"
              value={priceRange.min}
              onChange={(e) => onChangePriceRange('min', e.target.value)}
              className="form-input"
              style={{ padding: '0.5rem 0.75rem' }}
            />
            <span style={{ color: 'var(--text-muted)' }}>-</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={priceRange.max}
              onChange={(e) => onChangePriceRange('max', e.target.value)}
              className="form-input"
              style={{ padding: '0.5rem 0.75rem' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
