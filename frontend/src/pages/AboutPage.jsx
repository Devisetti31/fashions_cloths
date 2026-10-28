import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Feather, ShieldCheck, HeartHandshake, Compass, Gem, ArrowRight } from 'lucide-react';
import BrandStory from '../components/BrandStory';
import Features from '../components/Features';
import './ShopPage.css';

export default function AboutPage() {
  return (
    <div className="shop-page">
      {/* Banner */}
      <section className="shop-banner">
        <h1 className="shop-banner-title">About ES ETHNIC STYLES</h1>
        <p className="shop-banner-subtitle">
          Timeless Tradition, Modern You &bull; The Atelier Story
        </p>
      </section>

      <div className="shop-container" style={{ maxWidth: '960px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-antique-gold)', marginBottom: '0.5rem' }}>
            Our Purpose &amp; Ethos
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)', fontSize: '2.5rem', marginBottom: '1rem' }}>
            Elevating Indian Handloom Couture for the Contemporary Era
          </h2>
          <div className="gold-divider">
            <span className="gold-diamond" />
          </div>
        </div>

        <div style={{ fontSize: '1.05rem', lineHeight: '1.85', color: 'var(--color-text-main)', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}>
          <p>
            <strong>ES ETHNIC STYLES</strong> was conceived from a deep reverence for the exquisite textile
            mastery passed down through generations of Indian weavers and artisans. Our guiding principle,
            <em> &ldquo;Timeless Tradition, Modern You&rdquo;</em>, captures the harmony between
            centuries-old handloom techniques and the lifestyle of the modern patron.
          </p>
          <p>
            Rather than following fleeting fast-fashion cycles, our atelier curates heirloom garments designed
            to be cherished, celebrated, and passed down. Every Banarasi saree, Kanjeevaram weave,
            and zardozi bridal lehenga embodies mindful craftsmanship, pure natural fibers, and
            transparent artisan partnerships.
          </p>
        </div>

        {/* Core Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem', marginBottom: '4rem' }}>
          <div style={{ padding: '2rem', backgroundColor: 'var(--color-ivory-surface)', border: '1px solid var(--color-antique-gold-border)', borderRadius: 'var(--radius-md)' }}>
            <Feather size={24} style={{ color: 'var(--color-burgundy)', marginBottom: '1rem' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
              Handloom Integrity
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              We partner directly with handloom weaver societies in Varanasi, Kanchipuram, Chanderi, and Lucknow, guaranteeing pure silk and authentic zari.
            </p>
          </div>

          <div style={{ padding: '2rem', backgroundColor: 'var(--color-ivory-surface)', border: '1px solid var(--color-antique-gold-border)', borderRadius: 'var(--radius-md)' }}>
            <Compass size={24} style={{ color: 'var(--color-burgundy)', marginBottom: '1rem' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
              Modern Ergonomics
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              Our garments are tailored with breathable natural linings, balanced flare construction, and custom blouse sizing to ensure supreme comfort.
            </p>
          </div>

          <div style={{ padding: '2rem', backgroundColor: 'var(--color-ivory-surface)', border: '1px solid var(--color-antique-gold-border)', borderRadius: 'var(--radius-md)' }}>
            <ShieldCheck size={24} style={{ color: 'var(--color-burgundy)', marginBottom: '1rem' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
              Silk Mark Certified
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              Every saree and lehenga fabric undergoes rigorous fiber authentication to ensure our patrons receive only genuine natural silk.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '3rem 2rem', backgroundColor: 'var(--color-blush-pink-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-antique-gold-border)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)', fontSize: '1.85rem', marginBottom: '0.75rem' }}>
            Experience the Collection
          </h3>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
            Explore our curated digital showroom and discover your next celebratory heirloom.
          </p>
          <Link to="/shop" className="btn btn-primary">
            <span>Discover The Entire Boutique</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
