import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, FileText, ArrowRight } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

export default function LegalPage() {
  const { pathname } = useLocation();

  const getPolicyType = () => {
    if (pathname.includes('/shipping')) return 'shipping';
    if (pathname.includes('/refund') || pathname.includes('/return')) return 'refund';
    if (pathname.includes('/terms')) return 'terms';
    return 'privacy';
  };

  const activePolicy = getPolicyType();

  const policies = [
    { id: 'privacy', path: '/privacy-policy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', path: '/terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'shipping', path: '/shipping-policy', label: 'Shipping & Delivery', icon: Truck },
    { id: 'refund', path: '/refund-policy', label: 'Returns & Refunds', icon: RotateCcw },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-ivory)', minHeight: '80vh', padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Policy Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            marginBottom: '2.5rem',
            borderBottom: '1px solid rgba(74, 23, 28, 0.1)',
          }}
        >
          {policies.map((p) => {
            const Icon = p.icon;
            const isActive = activePolicy === p.id;
            return (
              <Link
                key={p.id}
                to={p.path}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.15rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  backgroundColor: isActive ? 'var(--color-burgundy)' : 'rgba(74, 23, 28, 0.05)',
                  color: isActive ? '#ffffff' : 'var(--color-text-primary)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={15} />
                <span>{p.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Policy Content Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(184, 138, 69, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '3rem 2.5rem',
            boxShadow: '0 8px 30px rgba(74, 23, 28, 0.04)',
            lineHeight: 1.8,
            color: 'var(--color-text-primary)',
          }}
        >
          {activePolicy === 'privacy' && (
            <div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--color-burgundy)', marginBottom: '0.5rem' }}>
                Privacy Policy
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                Effective Date: October 2026 &bull; {BUSINESS_CONFIG.name}
              </p>

              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-burgundy)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                1. Information We Collect
              </h2>
              <p>
                At {BUSINESS_CONFIG.name}, we respect the sanctity of our patrons&apos; personal data. We collect
                identifying details (name, email address, contact telephone, and delivery residence) strictly to
                facilitate artisanal couture orders, made-to-measure fittings, and bespoke customer communications.
              </p>

              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-burgundy)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                2. Data Protection &amp; Security
              </h2>
              <p>
                All account credentials and passwords are encrypted using modern industry cryptographic standards (bcrypt).
                Session access tokens are cryptographically signed. We never trade, rent, or disclose patron details to
                unauthorized commercial third parties.
              </p>

              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-burgundy)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                3. Concierge Data Inquiries
              </h2>
              <p>
                To request modification or deletion of your patron profile, please contact our data concierge at{' '}
                <a href={`mailto:${BUSINESS_CONFIG.contact.email}`} style={{ color: 'var(--color-burgundy)', fontWeight: 600 }}>
                  {BUSINESS_CONFIG.contact.email}
                </a>.
              </p>
            </div>
          )}

          {activePolicy === 'terms' && (
            <div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--color-burgundy)', marginBottom: '0.5rem' }}>
                Terms and Conditions
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                Last Updated: October 2026 &bull; {BUSINESS_CONFIG.name}
              </p>

              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-burgundy)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                1. Handloom &amp; Artisanal Authenticity
              </h2>
              <p>
                Each silhouette curated at {BUSINESS_CONFIG.name} represents authentic Indian handlooms, real zari weaving,
                and delicate manual craftsmanship. Subtle irregularities in weaves or dyes are natural hallmarks of authentic
                handloom traditions and not manufactured defects.
              </p>

              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-burgundy)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                2. Pricing &amp; Inventory Accuracy
              </h2>
              <p>
                All prices are stated in Indian Rupees (INR) and calculated authoritatively by our backend registry. We reserve
                the right to rectify typographical discrepancies prior to dispatch.
              </p>

              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-burgundy)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                3. Intellectual Property
              </h2>
              <p>
                The {BUSINESS_CONFIG.name} brand monogram, editorial visual campaigns, and couture designs remain the exclusive
                property of the atelier.
              </p>
            </div>
          )}

          {activePolicy === 'shipping' && (
            <div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--color-burgundy)', marginBottom: '0.5rem' }}>
                Shipping &amp; Delivery Policy
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                Insured White-Glove Couture Dispatch
              </p>

              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-burgundy)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                1. Domestic Delivery Across India
              </h2>
              <p>
                We provide complimentary insured shipping across India on all couture orders exceeding ₹15,000. Ready-to-wear
                ensembles are dispatched within 2–3 business days. Bespoke handloom and bridal orders requiring custom tailoring
                typically require 10–14 business days.
              </p>

              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-burgundy)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                2. Tamper-Evident Luxury Packaging
              </h2>
              <p>
                Every garment is enclosed in breathable muslin protection and encased in signature {BUSINESS_CONFIG.name} gold-stamped
                couture packaging to protect fine zari embroidery during transit.
              </p>

              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-burgundy)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                3. Real-Time Tracking
              </h2>
              <p>
                Upon dispatch, your tracking airway bill (AWB) is updated automatically in your{' '}
                <Link to="/account/orders" style={{ color: 'var(--color-burgundy)', fontWeight: 600 }}>
                  Patron Account Orders Portal
                </Link>.
              </p>
            </div>
          )}

          {activePolicy === 'refund' && (
            <div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--color-burgundy)', marginBottom: '0.5rem' }}>
                Return &amp; Refund Policy
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                7-Day Hassle-Free Boutique Exchange
              </p>

              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-burgundy)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                1. Return Eligibility
              </h2>
              <p>
                Unworn ready-to-wear garments in original pristine condition with intact boutique security tags and silk mark
                authenticity certificates may be exchanged or returned within 7 calendar days of receipt.
              </p>

              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-burgundy)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                2. Made-to-Measure &amp; Bridal Exceptions
              </h2>
              <p>
                Garments custom-tailored to specific patron body measurements (bridal lehengas and stitched blouses) are not
                eligible for monetary refunds, but include complimentary atelier alteration fittings until perfection is achieved.
              </p>

              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-burgundy)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                3. Initiating a Return
              </h2>
              <p>
                To schedule a complimentary insured courier pickup, please connect with our WhatsApp concierge or contact{' '}
                <a href={`mailto:${BUSINESS_CONFIG.contact.email}`} style={{ color: 'var(--color-burgundy)', fontWeight: 600 }}>
                  {BUSINESS_CONFIG.contact.email}
                </a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
