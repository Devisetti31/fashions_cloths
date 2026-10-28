import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './QuickViewModal.css';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const { addToCart, isInWishlist, toggleWishlist, formatPrice } = useShop();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState(
    product && product.sizes && product.sizes.length === 1 ? product.sizes[0] : ''
  );
  const [sizeError, setSizeError] = useState(false);

  if (!isOpen || !product) return null;

  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize, product.colors && product.colors[0]);
    onClose();
  };

  return (
    <div
      className="quickview-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
      onClick={onClose}
    >
      <div className="quickview-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="quickview-close-btn"
          onClick={onClose}
          aria-label="Close Quick View"
        >
          <X size={20} />
        </button>

        {/* Media */}
        <div className="quickview-media">
          <img
            src={product.images && product.images[0]}
            alt={product.name}
            className="quickview-img"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Info & Variants */}
        <div className="quickview-body">
          <span className="quickview-category">{product.categoryLabel}</span>
          <h3 id="quickview-title" className="quickview-title">
            {product.name}
          </h3>

          <div className="quickview-pricing">
            <span className="quickview-price">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="quickview-original-price">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="quickview-desc">{product.description}</p>

          {/* Size Variant Selector */}
          <div className="variant-section">
            <div className="variant-label-row">
              <span>Select Size:</span>
              <span style={{ color: 'var(--color-antique-gold)', fontSize: '0.75rem' }}>
                {selectedSize || 'Required'}
              </span>
            </div>

            <div className="size-options-grid">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  className={`size-pill-btn ${selectedSize === sz ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedSize(sz);
                    setSizeError(false);
                  }}
                >
                  {sz}
                </button>
              ))}
            </div>

            {sizeError && (
              <div className="size-error-notice" role="alert">
                Please choose a size before adding this heirloom to your bag.
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="quickview-actions">
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={handleAddToCart}
            >
              <ShoppingBag size={16} />
              <span>Add to Bag</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '0.85rem' }}
              aria-label={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              title="Wishlist"
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <Link
              to={`/product/${product.id}`}
              style={{ fontSize: '0.85rem', color: 'var(--color-antique-gold)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              onClick={onClose}
            >
              <span>View Full Product Specifications</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
