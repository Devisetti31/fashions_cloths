import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import './EditorialShowcase.css';

export default function EditorialShowcase() {
  const [imgFailed, setImgFailed] = useState(false);
  const editorialImage =
    'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=85';

  return (
    <section className="editorial-section" aria-labelledby="editorial-showcase-title">
      <div className="editorial-container">
        {/* Left Visual Composition */}
        <div className="editorial-visual-stack">
          <div className="editorial-img-frame">
            {!imgFailed ? (
              <img
                src={editorialImage}
                alt="The Royal Bridal & Festive Vault by ES ETHNIC STYLES"
                className="editorial-img"
                loading="lazy"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #4A171C, #2F0B0F)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-blush-pink)',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                }}
              >
                The Bridal Vault
              </div>
            )}
            <div className="editorial-badge-inset">
              <span className="editorial-badge-year">Atelier Edit</span>
              <span className="editorial-badge-sub">Bespoke Bridal</span>
            </div>
          </div>
        </div>

        {/* Right Editorial Copy */}
        <div className="editorial-text-col">
          <div className="editorial-tag">
            <Sparkles size={14} aria-hidden="true" />
            <span>Featured Editorial Spotlight</span>
          </div>

          <h2 id="editorial-showcase-title" className="editorial-heading">
            The Royal Bridal &amp; Festive Vault
          </h2>

          <blockquote className="editorial-quote">
            &ldquo;True elegance does not shout; it drapes effortlessly, steeped in centuries
            of Indian artisanal pride.&rdquo;
          </blockquote>

          <p className="editorial-body-copy">
            Every bride and celebratory patron deserves garments infused with soul. Our couture
            artisans hand-stitch antique bullion wires, micro-pearls, and luminous zardozi across
            voluminous 16-panel micro-velvets and handwoven tissue silks.
          </p>

          <div className="editorial-cta-group">
            <Link to="/category/lehengas" className="btn btn-gold">
              <span>Explore Bridal Lehengas</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/shop" className="btn btn-secondary" style={{ borderColor: 'var(--color-blush-pink)', color: 'var(--color-ivory)' }}>
              <span>View All Silhouettes</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
