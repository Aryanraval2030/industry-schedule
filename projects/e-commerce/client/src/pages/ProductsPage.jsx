import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilter } from '../components/product/ProductFilter';
import { Spinner } from '../components/common/Loader';
import { Search, PackageOpen } from 'lucide-react';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state from URL or defaults
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';

  const [searchInput, setSearchInput] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSort, setSelectedSort] = useState(sortParam);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  // Sync state if URL changes externally
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
    setSearchInput(searchParams.get('search') || '');
    setSelectedSort(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  // Load filtered products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          category: selectedCategory,
          search: searchInput,
          sort: selectedSort,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
        };

        const data = await fetchProducts(params);
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadProducts, 200);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchInput, selectedSort, priceRange]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleSortSelect = (sort) => {
    setSelectedSort(sort);
    searchParams.set('sort', sort);
    setSearchParams(searchParams);
  };

  const handlePriceRangeChange = (field, val) => {
    setPriceRange((prev) => ({ ...prev, [field]: val }));
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchInput('');
    setSelectedSort('newest');
    setPriceRange({ min: '', max: '' });
    setSearchParams({});
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      {/* Header & Search */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 className="title-section" style={{ marginBottom: '0.25rem' }}>
            Products Catalog
          </h1>
          <p className="text-muted">
            Showing {products.length} products available for instant order
          </p>
        </div>

        {/* Live Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>
      </div>

      {/* Filter Bar */}
      <ProductFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        selectedSort={selectedSort}
        onSelectSort={handleSortSelect}
        priceRange={priceRange}
        onChangePriceRange={handlePriceRangeChange}
        onResetFilters={handleResetFilters}
      />

      {/* Products Grid / Status */}
      {loading ? (
        <Spinner message="Searching products catalog..." />
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
      ) : products.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <PackageOpen size={48} style={{ margin: '0 auto' }} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No products match your criteria
          </h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
            Try adjusting your search terms or clearing current filters.
          </p>
          <button onClick={handleResetFilters} className="btn btn-primary">
            Clear All Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
