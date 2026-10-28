import React from 'react';
import { X, User, ShieldCheck, Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export default function AccountModal({ isOpen, onClose }) {
  const { wishlistCount, cartCount } = useShop();

  if (!isOpen) return null;

  return (
    <div
      className="quickview-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-dialog-title"
      onClick={onClose}
    >
      <div
        className="quickview-card"
        style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="quickview-close-btn"
          onClick={onClose}
          aria-label="Close Account Dialog"
        >
          <X size={20} />
        </button>

        <div style={{ padding: '2.5rem 2rem 2rem', textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-blush-pink-light)',
              border: '1px solid var(--color-antique-gold)',
              color: 'var(--color-burgundy)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <User size={30} />
          </div>

          <h3 id="account-dialog-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-burgundy)', marginBottom: '0.35rem' }}>
            Boutique Patron Portal
          </h3>
          <p style={{ color: 'var(--color-antique-gold)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
            ES ETHNIC STYLES Atelier
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <Link
              to="/wishlist"
              onClick={onClose}
              style={{
                padding: '1rem',
                backgroundColor: 'var(--color-ivory-surface)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(74, 23, 28, 0.1)',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Heart size={20} style={{ color: 'var(--color-burgundy)', marginBottom: '0.35rem' }} />
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Wishlist</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-burgundy)' }}>{wishlistCount} Saved</div>
            </Link>

            <Link
              to="/cart"
              onClick={onClose}
              style={{
                padding: '1rem',
                backgroundColor: 'var(--color-ivory-surface)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(74, 23, 28, 0.1)',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <ShoppingBag size={20} style={{ color: 'var(--color-burgundy)', marginBottom: '0.35rem' }} />
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Shopping Bag</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-burgundy)' }}>{cartCount} Items</div>
            </Link>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-blush-pink-light)',
              border: '1px dashed var(--color-antique-gold)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--color-burgundy)',
              lineHeight: 1.5,
              marginBottom: '1.5rem',
              textAlign: 'left',
            }}
          >
            <Sparkles size={14} style={{ display: 'inline', marginRight: '6px', color: 'var(--color-antique-gold)' }} />
            <strong>Phase 2 Demonstration Notice:</strong> Full customer login, order tracking, and bespoke measurement profiles will be connected to the FastAPI authentication engine in Phase 3.
          </div>

          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={onClose}
          >
            Continue Browsing Collection
          </button>
        </div>
      </div>
    </div>
  );
}
