/**
 * ES ETHNIC STYLES — Official Business Configuration
 * Centralized settings for business contact, social media, customer care, and media assets.
 * 
 * Replace placeholders with your registered company credentials when deploying to production.
 */

export const BUSINESS_CONFIG = {
  name: 'ES ETHNIC STYLES',
  tagline: 'Timeless Tradition, Modern You',
  shortDescription:
    'A luxury Indian ethnic fashion house dedicated to preserving authentic handlooms, Banarasi brocades, and bespoke bridal silhouettes for the modern connoisseur.',

  // Official Contact Channels
  contact: {
    // Phone numbers (Digits-only for tel: protocol, formatted for visual display)
    phoneRaw: '919876543210',
    phoneFormatted: '+91 98765 43210',

    // WhatsApp business number (International format digits only, without '+' or spaces)
    whatsappNumber: '919876543210',
    whatsappDefaultMessage:
      'Hello ES ETHNIC STYLES Concierge, I would like to inquire about your curated couture collection.',

    // Official support email
    email: 'concierge@esethnicstyles.com',

    // Physical atelier location
    address: 'Heritage Atelier & Flagship Salon, Mumbai, Maharashtra 400001, India',
    workingHours: 'Monday – Saturday: 10:00 AM – 8:00 PM IST',
  },

  // Official Social Media Profiles
  social: {
    instagramUrl: 'https://www.instagram.com/esethnicstyles',
    instagramHandle: '@esethnicstyles',
  },

  // Media & Video Configuration
  media: {
    // Drop your promotional video file into: frontend/public/videos/hero-fashion.mp4
    heroVideoUrl: '/videos/hero-fashion.mp4',
    // Editorial campaign poster used as fallback & initial frame
    heroPosterUrl:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=85',
  },
};

/**
 * Build a validated WhatsApp click-to-chat URL: https://wa.me/<number>?text=<encoded_text>
 */
export function getWhatsAppUrl(customMessage) {
  const number = (BUSINESS_CONFIG.contact.whatsappNumber || '').replace(/[^0-9]/g, '');
  if (!number) return '#';
  const message = customMessage || BUSINESS_CONFIG.contact.whatsappDefaultMessage;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Build a validated tel: link
 */
export function getTelephoneUrl() {
  const number = (BUSINESS_CONFIG.contact.phoneRaw || '').replace(/[^0-9]/g, '');
  return number ? `tel:+${number}` : '#';
}

/**
 * Build a validated mailto: link
 */
export function getMailtoUrl(subject) {
  const email = BUSINESS_CONFIG.contact.email;
  const sub = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return `mailto:${email}${sub}`;
}
