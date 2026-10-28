import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please provide administrator credentials.');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await login(cleanEmail, cleanPassword);

      // Verify server-side administrator role
      if (!user.is_admin) {
        logout();
        setError('Access denied: Administrator privileges required.');
        return;
      }

      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container" style={{ background: '#292326' }}>
      <div className="auth-card auth-card-admin">
        <div className="auth-header">
          <div className="admin-badge-indicator">Authorized Access Only</div>
          <div
            className="auth-monogram"
            style={{
              backgroundColor: 'rgba(184, 138, 69, 0.15)',
              color: 'var(--color-antique-gold)',
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <h1 className="auth-title">Atelier Director Portal</h1>
          <p className="auth-subtitle">ES ETHNIC STYLES Administrative Console</p>
        </div>

        {error && (
          <div className="auth-error-alert" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-field-group">
            <label htmlFor="admin-email" className="auth-label">
              Admin Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              placeholder="admin@esethnicstyles.com"
              autoComplete="email"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="auth-field-group">
            <label htmlFor="admin-password" className="auth-label">
              Security Key / Password
            </label>
            <div className="auth-input-wrapper">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input auth-input-with-icon"
                placeholder="Enter administrator password"
                autoComplete="current-password"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            style={{ backgroundColor: 'var(--color-antique-gold)', borderColor: 'var(--color-antique-gold)' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Verifying Privileges...</span>
              </>
            ) : (
              <>
                <span>Enter Administration</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer" style={{ display: 'flex', justifyContent: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-text-muted)',
              fontSize: '0.85rem',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} />
            <span>Return to Boutique Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
