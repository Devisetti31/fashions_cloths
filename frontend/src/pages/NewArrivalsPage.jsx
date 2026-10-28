import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Clock, ArrowRight, ChevronRight, PackageOpen, RefreshCw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { fetchNewArrivals } from '../services/productService';
import './NewArrivalsPage.css';

export default function NewArrivalsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFromApi, setIsFromApi] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const loadNewArrivals = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchNewArrivals({ page: 1, pageSize: 50 });
      setProducts(result.products || []);
      setIsFromApi(Boolean(result.isFromApi));
    } catch (err) {
      setError('Unable to load new arrivals at this moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewArrivals();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="new-arrivals-page" data-testid="new-arrivals-page">
      {/* Editorial Header Banner */}
      <section className="new-arrivals-banner" aria-labelledby="new-arrivals-heading">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <Link to="/" style={{ color: 'var(--color-blush-pink)', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} style={{ color: 'var(--color-antique-gold)' }} />
          <Link to="/shop" style={{ color: 'var(--color-blush-pink)', textDecoration: 'none' }}>Shop All</Link>
          <ChevronRight size={14} style={{ color: 'var(--color-antique-gold)' }} />
          <span style={{ color: 'var(--color-ivory)' }}>New Arrivals</span>
        </nav>

        <div className="new-arrivals-pill">
          <Sparkles size={14} className="new-arrivals-sparkle" aria-hidden="true" />
          <span>Fresh Atelier Capsule</span>
        </div>

        <h1 id="new-arrivals-heading" className="new-arrivals-title">
          New Arrivals
        </h1>

        <p className="new-arrivals-subtitle">
          Timeless Tradition, Modern You — The Latest Curations
        </p>

        <p className="new-arrivals-desc">
          Experience our latest celebratory creations fresh from our master weavers and artisans.
          Featuring Varanasi katan silks, hand-embroidered anarkalis, and regal bridal silhouettes ordered by newest creation date.
        </p>
      </section>

      {/* Main Content Area */}
      <div className="new-arrivals-container">
        {/* Meta Bar: Product Count & Sort Order Indicator */}
        <div className="new-arrivals-meta-bar">
          <div className="new-arrivals-count" aria-label={`Showing ${products.length} Heirloom Silhouettes`}>
            Showing <strong>{products.length}</strong> Heirloom Silhouettes
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="new-arrivals-sort-badge" title="Sorted by database creation timestamp (newest first)">
              <Clock size={14} />
              <span>Sorted: Newest First</span>
            </div>

            {isFromApi && (
              <span className="new-arrivals-live-tag" title="Connected to FastAPI database">
                ● Live Database
              </span>
            )}

            <button
              type="button"
              onClick={loadNewArrivals}
              className="action-btn"
              title="Refresh Collection"
              style={{ width: '32px', height: '32px', padding: 0 }}
              aria-label="Refresh new arrivals"
            >
              <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
            </button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="new-arrivals-skeleton-grid" aria-label="Loading new arrivals">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="new-arrivals-skeleton-card">
                <div className="new-arrivals-skeleton-img" />
                <div className="new-arrivals-skeleton-body">
                  <div className="new-arrivals-skeleton-line short" />
                  <div className="new-arrivals-skeleton-line" />
                  <div className="new-arrivals-skeleton-line short" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clean, Attractive Empty State */}
        {!loading && products.length === 0 && (
          <div className="new-arrivals-empty-state" role="status">
            <div className="new-arrivals-empty-icon">
              <PackageOpen size={30} />
            </div>
            <h2 className="new-arrivals-empty-title">Fresh Heirlooms Arriving Soon</h2>
            <p className="new-arrivals-empty-desc">
              Our guild weavers and master ateliers are currently tailoring the upcoming seasonal silhouettes.
              Explore our complete boutique collection in the meantime.
            </p>
            <Link to="/shop" className="btn btn-primary">
              <span>Browse All Silhouettes</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id || product.slug} className="product-card-wrapper">
                <ProductCard
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />

                {/* Available Sizes / Variants Indicator */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="product-card-variants-bar" aria-label={`Available sizes for ${product.name}`}>
                    <span>Sizes:</span>
                    {product.sizes.slice(0, 4).map((size, idx) => (
                      <span key={idx} className="variant-size-chip">
                        {size}
                      </span>
                    ))}
                    {product.sizes.length > 4 && (
                      <span className="variant-size-chip">+{product.sizes.length - 4} more</span>
                    )}
                  </div>
                )}
              </div>
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
