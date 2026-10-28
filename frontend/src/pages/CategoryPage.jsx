import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { PRODUCTS, CATEGORIES } from '../data/products';
import './ShopPage.css';

export default function CategoryPage() {
  const { category } = useParams();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const categoryMeta = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === (category || '').toLowerCase()
  );

  // If category does not exist, redirect to 404 or shop
  if (!categoryMeta) {
    return (
      <div className="shop-page">
        <div className="shop-container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)', fontSize: '2rem', marginBottom: '1rem' }}>
            Category Not Found
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            The requested collection &ldquo;{category}&rdquo; is not part of our active atelier.
          </p>
          <Link to="/shop" className="btn btn-primary">
            <span>Browse All Silhouettes</span>
          </Link>
        </div>
      </div>
    );
  }

  const categoryProducts = PRODUCTS.filter((p) => {
    if (categoryMeta.slug === 'new-arrivals') {
      return p.isNew;
    }
    return p.category.toLowerCase() === categoryMeta.slug.toLowerCase();
  });

  return (
    <div className="shop-page">
      {/* Category Editorial Banner */}
      <section className="shop-banner" style={{ background: categoryMeta.fallbackBg }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <Link to="/" style={{ color: 'var(--color-blush-pink)', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} style={{ color: 'var(--color-antique-gold)' }} />
          <Link to="/shop" style={{ color: 'var(--color-blush-pink)', textDecoration: 'none' }}>Shop</Link>
          <ChevronRight size={14} style={{ color: 'var(--color-antique-gold)' }} />
          <span style={{ color: 'var(--color-ivory)' }}>{categoryMeta.title}</span>
        </nav>

        <h1 className="shop-banner-title">{categoryMeta.title}</h1>
        <p className="shop-banner-subtitle">{categoryMeta.subtitle}</p>
        <p style={{ maxWidth: '650px', margin: '1rem auto 0', color: 'rgba(255, 252, 248, 0.85)', fontSize: '0.95rem' }}>
          {categoryMeta.description}
        </p>
      </section>

      <div className="shop-container">
        {/* Header navigation bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Link
            to="/shop"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-burgundy)', fontWeight: 600, textDecoration: 'none' }}
          >
            <ArrowLeft size={16} />
            <span>All Boutique Categories</span>
          </Link>

          <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Showing <strong>{categoryProducts.length}</strong> Heirlooms
          </span>
        </div>

        {/* Product Grid */}
        <div className="products-grid">
          {categoryProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
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
