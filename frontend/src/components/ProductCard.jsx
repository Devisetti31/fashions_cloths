import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './ProductCard.css';

export default function ProductCard({ product, onQuickView }) {
  const [imgError, setImgError] = useState(false);
  const { isInWishlist, toggleWishlist, formatPrice } = useShop();

  if (!product) return null;

  const wishlisted = isInWishlist(product.id);
  const primaryImage = product.images && product.images[0];

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <article className="product-card" aria-label={`Product card for ${product.name}`}>
      {/* Media Box */}
      <div className="product-card-media">
        <Link to={`/product/${product.id}`} tabIndex={-1} aria-hidden="true">
          {!imgError && primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="product-card-img"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="product-card-fallback">
              <span className="product-card-fallback-monogram">ES</span>
              <span style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Boutique Heirloom</span>
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="product-card-badges">
          {product.isNew && <span className="badge-tag badge-new">New In</span>}
          {product.isSale && discountPercent && (
            <span className="badge-tag badge-sale">{discountPercent}% Off</span>
          )}
        </div>

        {/* Floating Actions */}
        <div className="product-card-floating-actions">
          <button
            type="button"
            className={`product-action-icon-btn ${wishlisted ? 'active-wishlist' : ''}`}
            aria-label={wishlisted ? `Remove ${product.name} from Wishlist` : `Save ${product.name} to Wishlist`}
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            onClick={() => toggleWishlist(product.id)}
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>

          {onQuickView && (
            <button
              type="button"
              className="product-action-icon-btn"
              aria-label={`Quick view details for ${product.name}`}
              title="Quick View"
              onClick={() => onQuickView(product)}
            >
              <Eye size={16} />
            </button>
          )}
        </div>

        {/* Hover drawer quick view CTA */}
        {onQuickView && (
          <div className="product-card-hover-drawer">
            <button
              type="button"
              className="btn-quick-view"
              onClick={() => onQuickView(product)}
            >
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* Body Info */}
      <div className="product-card-body">
        <span className="product-card-category">{product.categoryLabel}</span>
        <Link to={`/product/${product.id}`} className="product-card-title">
          {product.name}
        </Link>
        <div className="product-card-fabric" title={product.fabric}>
          {product.fabric}
        </div>

        {/* Pricing */}
        <div className="product-card-pricing">
          <span className="product-card-current-price">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="product-card-original-price">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {discountPercent && (
            <span className="product-card-discount-tag">Save {discountPercent}%</span>
          )}
        </div>
      </div>
    </article>
  );
}
