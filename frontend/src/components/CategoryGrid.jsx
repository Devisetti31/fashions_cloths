import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import './CategoryGrid.css';

export default function CategoryGrid() {
  return (
    <section className="category-section" aria-labelledby="curated-edits-title">
      <div className="category-container">
        <div className="category-header">
          <div className="category-pretitle">Boutique Curations</div>
          <h2 id="curated-edits-title" className="category-title">
            Curated Categories of Elegance
          </h2>
          <div className="gold-divider">
            <span className="gold-diamond" />
          </div>
          <p className="category-subtitle">
            Explore our signature textile collections, handcrafted with centuries of weaver
            heritage and styled for the discerning modern silhouette.
          </p>
        </div>

        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="category-card"
              aria-label={`Explore ${cat.title} collection`}
            >
              <div className="category-card-img-wrapper" style={{ background: cat.fallbackBg }}>
                <img
                  src={cat.image}
                  alt={`${cat.title} category curation`}
                  className="category-card-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="category-card-overlay" />
              </div>

              <div className="category-card-content">
                <span className="category-card-count">{cat.itemCount}</span>
                <h3 className="category-card-title">{cat.title}</h3>
                <p className="category-card-desc">{cat.subtitle}</p>
                <span className="category-card-cta">
                  <span>Explore Collection</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
