import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import './Newsletter.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || email.trim() === '') {
      setStatus({ state: 'error', message: 'Please enter your email address.' });
      return;
    }

    // Email format validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setStatus({ state: 'error', message: 'Please enter a valid email address (e.g. name@domain.com).' });
      return;
    }

    setStatus({
      state: 'success',
      message: 'Thank you for joining. You will receive private invitations to our upcoming couture unveils.',
    });
    setEmail('');
  };

  return (
    <section className="newsletter-section" aria-labelledby="newsletter-title">
      <div className="newsletter-container">
        <div className="newsletter-icon-badge" aria-hidden="true">
          <Mail size={22} />
        </div>

        <h2 id="newsletter-title" className="newsletter-title">
          Join The Atelier Circle
        </h2>

        <p className="newsletter-subtitle">
          Be the first to preview limited-edition Varanasi handlooms, bridal capsule debuts,
          and private festive trunk shows.
        </p>

        <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
          <div className="newsletter-input-wrapper">
            <Mail size={16} className="newsletter-input-icon" aria-hidden="true" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status.state !== 'idle') setStatus({ state: 'idle', message: '' });
              }}
              placeholder="Enter your email address"
              aria-label="Email address for boutique newsletter"
              className="newsletter-input"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            <span>Join Circle</span>
          </button>
        </form>

        <div className="newsletter-feedback" aria-live="polite">
          {status.state === 'success' && (
            <span className="feedback-success">
              <CheckCircle2 size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
              {status.message}
            </span>
          )}
          {status.state === 'error' && (
            <span className="feedback-error">
              {status.message}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
