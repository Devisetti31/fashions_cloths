import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { PRODUCTS } from '../data/products';
import { useShop } from '../context/ShopContext';
import './FeaturedProducts.css';

export default function FeaturedProducts({ onQuickView }) {
  const { products } = useShop();
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Featured' },
    { id: 'sarees', label: 'Sarees' },
    { id: 'lehengas', label: 'Lehengas' },
    { id: 'kurtis', label: 'Kurtis' },
    { id: 'festive-wear', label: 'Festive Wear' },
  ];

  const filteredProducts = useMemo(() => {
    const sourceProducts = products && products.length > 0 ? products : PRODUCTS;
    let list = sourceProducts.filter((p) => p.isFeatured);
    if (activeTab !== 'all') {
      list = list.filter((p) => p.category === activeTab);
    }
    return list.slice(0, 8);
  }, [activeTab, products]);

  return (
    <section className="featured-section" aria-labelledby="featured-title">
      <div className="featured-container">
        <div className="featured-header">
          <div className="featured-pretitle">The Masterpiece Vault</div>
          <h2 id="featured-title" className="featured-title">
            Featured Couture &amp; Handlooms
          </h2>
          <div className="gold-divider">
            <span className="gold-diamond" />
          </div>
          <p className="featured-subtitle">
            Indulge in our most celebrated creations. Each piece is crafted with certified silk,
            antique gold threadwork, and artisanal tailoring.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="featured-tabs" role="tablist" aria-label="Filter featured products">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* Footer Navigation CTA */}
        <div className="featured-footer-row">
          <Link to="/shop" className="btn btn-primary">
            <span>Explore Entire Boutique ({PRODUCTS.length} Silhouettes)</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
