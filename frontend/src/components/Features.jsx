import React from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, Scissors } from 'lucide-react';
import './Features.css';

export default function Features() {
  const features = [
    {
      icon: <Sparkles size={24} />,
      title: 'Artisanal Heritage',
      description:
        'Sourced directly from India’s revered master weaver guilds in Varanasi, Kanchipuram, and Chanderi.',
    },
    {
      icon: <Scissors size={24} />,
      title: 'Made to Measure',
      description:
        'Personalized blouse tailoring, custom draping adjustments, and bespoke bridal consultations.',
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Authenticity Certified',
      description:
        'Every handloom includes verified Silk Mark certification and certified zari purity assurances.',
    },
    {
      icon: <HeartHandshake size={24} />,
      title: 'Weaver Empowerment',
      description:
        'Fair-trade partnerships investing directly into indigenous craft preservation and artisan families.',
    },
  ];

  return (
    <section id="heritage" className="features-section" aria-labelledby="features-title">
      <div className="features-container">
        <div className="features-header">
          <div className="features-pretitle">The Boutique Difference</div>
          <h2 id="features-title" className="features-title">Rooted in Tradition, Tailored for Now</h2>
          <div className="gold-divider">
            <span className="gold-diamond" />
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            ES ETHNIC STYLES is founded on uncompromised quality, timeless design, and a respectful
            tribute to timeless Indian textile traditions.
          </p>
        </div>

        <div className="features-grid">
          {features.map((item, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper" aria-hidden="true">
                {item.icon}
              </div>
              <h3 className="feature-card-title">{item.title}</h3>
              <p className="feature-card-text">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
