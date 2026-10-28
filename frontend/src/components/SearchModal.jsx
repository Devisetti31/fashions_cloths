import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useShop } from '../context/ShopContext';
import './SearchModal.css';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { formatPrice } = useShop();

  const quickTags = ['Banarasi', 'Kanjeevaram', 'Lehenga', 'Chikankari', 'Velvet', 'Silk'];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectProduct = (productId) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  const handleFullSearch = (searchTerm) => {
    onClose();
    navigate(`/shop?search=${encodeURIComponent(searchTerm || query)}`);
  };

  return (
    <div
      className="search-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      onClick={onClose}
    >
      <div className="search-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-header">
          <Search size={20} style={{ color: 'var(--color-antique-gold)' }} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            id="search-modal-title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleFullSearch(query);
              }
            }}
            placeholder="Search handloom sarees, bridal lehengas, kurtis..."
            className="search-input-field"
          />
          <button
            type="button"
            className="search-close-btn"
            onClick={onClose}
            aria-label="Close search overlay"
          >
            <X size={18} />
          </button>
        </div>

        <div className="search-modal-body">
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            Popular Atelier Inquiries:
          </div>
          <div className="search-quick-tags">
            {quickTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className="quick-tag-chip"
                onClick={() => setQuery(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Matches List */}
          {query.trim() && (
            <div className="search-results-list">
              {matches.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No matching silhouettes found for &ldquo;{query}&rdquo;.
                </div>
              ) : (
                matches.map((item) => (
                  <div
                    key={item.id}
                    className="search-result-item"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectProduct(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSelectProduct(item.id);
                    }}
                  >
                    <div className="search-result-thumb">
                      <img
                        src={item.images && item.images[0]}
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="search-result-info">
                      <div className="search-result-category">{item.categoryLabel}</div>
                      <div className="search-result-name">{item.name}</div>
                    </div>
                    <div className="search-result-price">{formatPrice(item.price)}</div>
                  </div>
                ))
              )}

              {matches.length > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.85rem' }}
                  onClick={() => handleFullSearch(query)}
                >
                  <span>View All Results for &ldquo;{query}&rdquo;</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
