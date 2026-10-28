import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import './ShopPage.css';

export default function NotFoundPage() {
  return (
    <div className="shop-page">
      <div className="shop-container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-blush-pink-light)',
            border: '1px solid var(--color-antique-gold)',
            color: 'var(--color-burgundy)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <Compass size={38} />
        </div>

        <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-antique-gold)', marginBottom: '0.5rem', display: 'block' }}>
          Error 404 &bull; Page Not Found
        </span>

        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)', fontSize: '2.8rem', marginBottom: '1rem' }}>
          This Silhouette Has Wandered Away
        </h1>

        <p style={{ color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.6, fontSize: '1rem' }}>
          The atelier route you are attempting to visit does not exist or may have been repositioned.
          Allow us to guide you back to our curated collections.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <span>Return to Homepage</span>
          </Link>
          <Link to="/shop" className="btn btn-secondary">
            <span>Browse All Collections</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
