import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw, PackageOpen } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { useShop } from '../context/ShopContext';
import './ShopPage.css';

export default function ShopPage() {
  const { products } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || 'all';
  const urlSort = searchParams.get('sort') || 'featured';

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [sortBy, setSortBy] = useState(urlSort);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Sync state when URL params change
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'all');
    setSortBy(searchParams.get('sort') || 'featured');
  }, [searchParams]);

  // Update URL params on user interaction
  const updateParams = (newSearch, newCat, newSort) => {
    const params = {};
    if (newSearch) params.search = newSearch;
    if (newCat && newCat !== 'all') params.category = newCat;
    if (newSort && newSort !== 'featured') params.sort = newSort;
    setSearchParams(params);
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    updateParams(val, selectedCategory, sortBy);
  };

  const handleCategorySelect = (catSlug) => {
    setSelectedCategory(catSlug);
    updateParams(searchTerm, catSlug, sortBy);
  };

  const handleSortChange = (sortVal) => {
    setSortBy(sortVal);
    updateParams(searchTerm, selectedCategory, sortVal);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('featured');
    setSearchParams({});
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const sourceProducts = products && products.length > 0 ? products : PRODUCTS;
    let list = [...sourceProducts];

    // Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'new-arrivals') {
        list = list.filter((p) => p.isNew);
      } else {
        list = list.filter((p) => p.category === selectedCategory);
      }
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  }, [searchTerm, selectedCategory, sortBy, products]);

  const hasActiveFilters = Boolean(searchTerm.trim() || selectedCategory !== 'all' || sortBy !== 'featured');

  return (
    <div className="shop-page">
      {/* Banner */}
      <section className="shop-banner">
        <h1 className="shop-banner-title">The Complete Boutique</h1>
        <p className="shop-banner-subtitle">
          Timeless Tradition, Modern You &bull; Curated Indian Ethnic Couture
        </p>
      </section>

      <div className="shop-container">
        {/* Controls Bar: Search & Sort */}
        <div className="shop-controls-bar">
          <div className="shop-search-wrapper">
            <Search size={17} className="shop-search-icon" aria-hidden="true" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name, zari craft, or fabric..."
              className="shop-search-input"
              aria-label="Filter products by search term"
            />
          </div>

          <div className="shop-filters-row">
            <label htmlFor="sort-select" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Sort:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="filter-select"
              aria-label="Sort products"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Additions</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="shop-category-pills" role="toolbar" aria-label="Filter by category">
          <button
            type="button"
            className={`cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategorySelect('all')}
          >
            All Silhouettes ({PRODUCTS.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cat-pill ${selectedCategory === cat.slug ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat.slug)}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Filter Summary */}
        <div className="active-filters-summary">
          <div>
            Showing <strong>{filteredProducts.length}</strong> of {PRODUCTS.length} silhouettes
            {searchTerm && <span> for &ldquo;{searchTerm}&rdquo;</span>}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="clear-filters-btn"
              onClick={handleResetFilters}
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* Product Grid / Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="shop-empty-state">
            <div className="shop-empty-icon" aria-hidden="true">
              <PackageOpen size={30} />
            </div>
            <h3 className="shop-empty-title">No Silhouettes Matched Your Search</h3>
            <p className="shop-empty-text">
              We could not find any items matching your selected criteria. Try adjusting your
              search term or resetting your active filters.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleResetFilters}
            >
              <RotateCcw size={15} />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
