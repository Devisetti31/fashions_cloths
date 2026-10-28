import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  PhoneCall,
  Mail,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import InstagramIcon from './icons/InstagramIcon';
import {
  BUSINESS_CONFIG,
  getWhatsAppUrl,
  getTelephoneUrl,
  getMailtoUrl,
} from '../config/business';
import './Footer.css';

export default function Footer({ onOpenHealthModal }) {
  const currentYear = new Date().getFullYear();
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-top-grid">
          {/* Section A — Brand & Section C — Follow Us */}
          <div className="footer-brand-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                  border: '1.5px solid var(--color-antique-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
                }}
              >
                {!logoFailed ? (
                  <img
                    src="/images/logo.png"
                    alt="ES ETHNIC STYLES Official Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    onError={() => setLogoFailed(true)}
                  />
                ) : (
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 700,
                      color: 'var(--color-blush-pink)',
                      fontSize: '1.15rem',
                    }}
                  >
                    ES
                  </span>
                )}
              </div>
              <h3 className="footer-brand-title">{BUSINESS_CONFIG.name}</h3>
            </div>

            <span className="footer-brand-tagline">{BUSINESS_CONFIG.tagline}</span>

            <p className="footer-brand-desc">
              {BUSINESS_CONFIG.shortDescription}
            </p>

            {/* Section C — Follow Us */}
            <div className="footer-social-section">
              <span className="footer-social-heading">Follow The Atelier</span>
              <div className="footer-social-row">
                <a
                  href={BUSINESS_CONFIG.social.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn instagram-btn"
                  aria-label="Follow ES ETHNIC STYLES on Instagram (opens in new tab)"
                  title="Official Instagram Profile"
                >
                  <InstagramIcon size={17} />
                  <span>Instagram</span>
                </a>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn whatsapp-btn"
                  aria-label="Connect with ES ETHNIC STYLES on WhatsApp (opens in new tab)"
                  title="Official WhatsApp Business Chat"
                >
                  <MessageCircle size={17} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Section B — Customer Support */}
          <div>
            <h4 className="footer-col-title">Customer Concierge</h4>
            <ul className="footer-contact-list">
              <li>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-contact-item highlight-contact"
                  title="Connect directly via WhatsApp"
                >
                  <MessageCircle size={16} className="contact-icon whatsapp-icon" />
                  <div>
                    <span className="contact-label">WhatsApp Support</span>
                    <span className="contact-val">+{BUSINESS_CONFIG.contact.phoneRaw}</span>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href={getTelephoneUrl()}
                  className="footer-contact-item"
                  title="Call the client concierge"
                >
                  <PhoneCall size={16} className="contact-icon" />
                  <div>
                    <span className="contact-label">Call Us</span>
                    <span className="contact-val">{BUSINESS_CONFIG.contact.phoneFormatted}</span>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href={getMailtoUrl()}
                  className="footer-contact-item"
                  title="Send email to concierge"
                >
                  <Mail size={16} className="contact-icon" />
                  <div>
                    <span className="contact-label">Email Support</span>
                    <span className="contact-val">{BUSINESS_CONFIG.contact.email}</span>
                  </div>
                </a>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="footer-contact-item"
                  title="Visit contact desk"
                >
                  <ArrowRight size={16} className="contact-icon" />
                  <div>
                    <span className="contact-label">Contact Desk</span>
                    <span className="contact-val">Schedule Atelier Fitting</span>
                  </div>
                </Link>
              </li>
            </ul>

            <div className="footer-hours-badge">
              <Clock size={13} style={{ color: 'var(--color-antique-gold)', flexShrink: 0 }} />
              <span>{BUSINESS_CONFIG.contact.workingHours}</span>
            </div>
          </div>

          {/* Section D — Quick Links (No login or register links!) */}
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/shop" className="footer-link">Shop All Silhouettes</Link></li>
              <li><Link to="/category/sarees" className="footer-link">Handloom Sarees</Link></li>
              <li><Link to="/category/kurtis" className="footer-link">Chikankari &amp; Kurtis</Link></li>
              <li><Link to="/category/lehengas" className="footer-link">Bridal Lehengas</Link></li>
              <li><Link to="/category/festive-wear" className="footer-link">Festive Wear</Link></li>
              <li><Link to="/about" className="footer-link">About ES ETHNIC STYLES</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
            </ul>
          </div>

          {/* Section E — Legal & Atelier Standards */}
          <div>
            <h4 className="footer-col-title">Policies &amp; Trust</h4>
            <ul className="footer-links-list">
              <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer-link">Terms and Conditions</Link></li>
              <li><Link to="/shipping-policy" className="footer-link">Shipping Policy</Link></li>
              <li><Link to="/refund-policy" className="footer-link">Return and Refund Policy</Link></li>
              <li>
                <span className="footer-badge-item">
                  <ShieldCheck size={14} style={{ color: 'var(--color-antique-gold)', display: 'inline', marginRight: '4px' }} />
                  100% Silk Mark Authenticity
                </span>
              </li>
              <li style={{ marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onOpenHealthModal}
                  className="footer-system-btn"
                  title="Check FastAPI & SQLite Architecture Status"
                >
                  <Sparkles size={12} />
                  <span>Platform System Check</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div>
            &copy; {currentYear} {BUSINESS_CONFIG.name}. All rights reserved. &bull; {BUSINESS_CONFIG.tagline}.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <span>Curated Artisanal Handlooms</span>
            <span>&bull;</span>
            <span>Haute Couture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
