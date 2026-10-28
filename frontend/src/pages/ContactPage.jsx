import React, { useState } from 'react';
import {
  MessageCircle,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import InstagramIcon from '../components/icons/InstagramIcon';
import {
  BUSINESS_CONFIG,
  getWhatsAppUrl,
  getTelephoneUrl,
  getMailtoUrl,
} from '../config/business';
import './Auth.css';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Bespoke Couture Consultation',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-ivory)', minHeight: '80vh', padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.3rem 0.85rem',
              backgroundColor: 'var(--color-blush-pink-light)',
              border: '1px solid var(--color-antique-gold)',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-burgundy)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={13} style={{ color: 'var(--color-antique-gold)' }} />
            <span>Dedicated Client Concierge</span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.8rem',
              color: 'var(--color-burgundy)',
              marginBottom: '0.75rem',
            }}
          >
            Contact &amp; Customer Care
          </h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
            Whether you require bespoke sizing guidance, bridal ensemble styling, or silk mark verification, our
            concierge is at your service.
          </p>
        </div>

        {/* Contact Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Direct Channels Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* WhatsApp Card */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1.5rem',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(184, 138, 69, 0.25)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 4px 15px rgba(74, 23, 28, 0.04)',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MessageCircle size={26} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#16a34a' }}>
                  Instant WhatsApp Chat
                </span>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-burgundy)', margin: '0.2rem 0' }}>
                  Chat with a Stylist
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Immediate sizing, drape guidance &amp; fabric inquiries
                </p>
              </div>
            </a>

            {/* Telephone Call Card */}
            <a
              href={getTelephoneUrl()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1.5rem',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(184, 138, 69, 0.25)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 4px 15px rgba(74, 23, 28, 0.04)',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-blush-pink-light)',
                  border: '1px solid var(--color-antique-gold)',
                  color: 'var(--color-burgundy)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <PhoneCall size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-antique-gold)' }}>
                  Telephone Concierge
                </span>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-burgundy)', margin: '0.2rem 0' }}>
                  {BUSINESS_CONFIG.contact.phoneFormatted}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  {BUSINESS_CONFIG.contact.workingHours}
                </p>
              </div>
            </a>

            {/* Email Card */}
            <a
              href={getMailtoUrl()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1.5rem',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(184, 138, 69, 0.25)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 4px 15px rgba(74, 23, 28, 0.04)',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-blush-pink-light)',
                  border: '1px solid var(--color-antique-gold)',
                  color: 'var(--color-burgundy)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Mail size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-antique-gold)' }}>
                  Email Concierge
                </span>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-burgundy)', margin: '0.2rem 0' }}>
                  {BUSINESS_CONFIG.contact.email}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Responses within 2 business hours
                </p>
              </div>
            </a>

            {/* Location & Instagram Card */}
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(74, 23, 28, 0.1)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.88rem' }}>
                <MapPin size={18} style={{ color: 'var(--color-antique-gold)', flexShrink: 0, marginTop: '2px' }} />
                <span>{BUSINESS_CONFIG.contact.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem' }}>
                <Clock size={18} style={{ color: 'var(--color-antique-gold)', flexShrink: 0 }} />
                <span>{BUSINESS_CONFIG.contact.workingHours}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(74, 23, 28, 0.08)' }}>
                <InstagramIcon size={18} style={{ color: '#E4405F', flexShrink: 0 }} />
                <a
                  href={BUSINESS_CONFIG.social.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-burgundy)', fontWeight: 600, textDecoration: 'none' }}
                >
                  Follow {BUSINESS_CONFIG.social.instagramHandle} on Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Inquiry Form Column */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid rgba(184, 138, 69, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '2.5rem',
              boxShadow: '0 8px 30px rgba(74, 23, 28, 0.05)',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-burgundy)', marginBottom: '0.5rem' }}>
              Send an Atelier Inquiry
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
              Please share your celebration details, styling preferences, or questions below.
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={48} style={{ color: '#16a34a', margin: '0 auto 1rem' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  Inquiry Dispatched
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Thank you, <strong>{formState.name}</strong>. Our bridal and couture concierge has received your
                  message and will contact you via email at <strong>{formState.email}</strong> shortly.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-field-group">
                  <label className="auth-label">Your Name *</label>
                  <input
                    type="text"
                    className="auth-input"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Radhika Merchant"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="auth-field-group">
                    <label className="auth-label">Email Address *</label>
                    <input
                      type="email"
                      className="auth-input"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="name@domain.com"
                      required
                    />
                  </div>
                  <div className="auth-field-group">
                    <label className="auth-label">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      className="auth-input"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="auth-field-group">
                  <label className="auth-label">Inquiry Focus</label>
                  <select
                    className="auth-input"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  >
                    <option value="Bespoke Couture Consultation">Bespoke Couture Consultation</option>
                    <option value="Bridal Lehenga Fitting">Bridal Lehenga Fitting &amp; Trousseau</option>
                    <option value="Handloom Saree Authenticity">Handloom Saree Silk Mark Inquiries</option>
                    <option value="Order Tracking & Delivery">Order Status &amp; Dispatch Tracking</option>
                    <option value="General Concierge Assistance">General Concierge Assistance</option>
                  </select>
                </div>

                <div className="auth-field-group">
                  <label className="auth-label">Message Details *</label>
                  <textarea
                    className="auth-input"
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Please specify sizing requirements, wedding date, or garment preferences..."
                    required
                  />
                </div>

                <button type="submit" className="auth-submit-btn" style={{ marginTop: '0.75rem' }}>
                  <Send size={16} />
                  <span>Transmit to Concierge</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
