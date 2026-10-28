import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  LogOut,
  Phone,
  Mail,
  Calendar,
  Package,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchMyOrders, updateCurrentProfile } from '../services/authService';
import './Account.css';

export default function AccountPage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState('');

  // Edit profile state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone_number || '');
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    async function loadOrders() {
      try {
        setLoadingOrders(true);
        const data = await fetchMyOrders();
        if (isMounted) {
          setOrders(data);
        }
      } catch (err) {
        if (isMounted) {
          setOrderError(err.message || 'Unable to retrieve orders.');
        }
      } finally {
        if (isMounted) {
          setLoadingOrders(false);
        }
      }
    }
    loadOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });

    if (!fullName.trim()) {
      setProfileMsg({ type: 'error', text: 'Full name cannot be empty.' });
      return;
    }

    try {
      setSavingProfile(true);
      const payload = {
        full_name: fullName.trim(),
        phone_number: phone.trim() || null,
      };

      if (newPassword) {
        if (!currentPassword) {
          setProfileMsg({
            type: 'error',
            text: 'Current password is required to set a new password.',
          });
          setSavingProfile(false);
          return;
        }
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }

      const updated = await updateCurrentProfile(payload);
      updateUser(updated);
      setCurrentPassword('');
      setNewPassword('');
      setProfileMsg({
        type: 'success',
        text: 'Patron profile updated successfully.',
      });
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.message || 'Failed to update profile.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
      case 'PROCESSING':
        return 'status-confirmed';
      case 'SHIPPED':
        return 'status-shipped';
      case 'DELIVERED':
        return 'status-delivered';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return 'status-confirmed';
    }
  };

  return (
    <div className="account-container">
      <div className="account-header">
        <div className="account-title-group">
          <h1>Patron Sanctuary</h1>
          <p>
            Welcome, <strong>{user?.full_name}</strong>. Manage your heirloom wardrobe and tracking details.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {user?.is_admin && (
            <Link
              to="/admin"
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.65rem 1rem' }}
            >
              <ShieldCheck size={16} style={{ marginRight: '6px' }} />
              Admin Portal
            </Link>
          )}
          <button
            type="button"
            className="account-logout-btn"
            onClick={handleLogout}
            aria-label="Sign out of account"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="account-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'orders'}
          className={`account-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingBag size={18} />
          <span>My Orders ({orders.length})</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'profile'}
          className={`account-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} />
          <span>Profile Details</span>
        </button>
      </div>

      <div className="account-grid">
        {/* Left Sidebar Profile Snapshot */}
        <aside className="profile-card">
          <div className="profile-avatar-circle">
            <User size={28} />
          </div>
          <h2 className="profile-name">{user?.full_name}</h2>
          <div className="profile-email">{user?.email}</div>

          <div className="profile-meta-list">
            <div className="profile-meta-item">
              <Mail size={16} style={{ color: 'var(--color-antique-gold)' }} />
              <span>{user?.email}</span>
            </div>
            {user?.phone_number && (
              <div className="profile-meta-item">
                <Phone size={16} style={{ color: 'var(--color-antique-gold)' }} />
                <span>{user?.phone_number}</span>
              </div>
            )}
            <div className="profile-meta-item">
              <Calendar size={16} style={{ color: 'var(--color-antique-gold)' }} />
              <span>Patron since {new Date(user?.created_at || Date.now()).getFullYear()}</span>
            </div>
          </div>
        </aside>

        {/* Right Main Content Panel */}
        <main>
          {activeTab === 'orders' && (
            <div>
              {loadingOrders ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto', color: 'var(--color-burgundy)' }} />
                  <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Retrieving your couture orders...</p>
                </div>
              ) : orderError ? (
                <div className="auth-error-alert">{orderError}</div>
              ) : orders.length === 0 ? (
                <div className="empty-orders-state">
                  <Package className="empty-orders-icon" />
                  <h3 className="empty-orders-title">No Couture Orders Yet</h3>
                  <p className="empty-orders-desc">
                    Your shopping bag awaits the artistry of authentic master handlooms, Banarasi silks, and bespoke bridal wear.
                  </p>
                  <Link to="/shop" className="btn btn-primary">
                    <span>Explore Boutique Collection</span>
                    <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                  </Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((ord) => (
                    <article key={ord.id} className="order-card">
                      <div className="order-card-header">
                        <div className="order-num-group">
                          <h3>{ord.order_number}</h3>
                          <span className="order-date">
                            Placed on {new Date(ord.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <span className={`order-status-badge ${getStatusClass(ord.status)}`}>
                          {ord.status}
                        </span>
                      </div>

                      <div className="order-items-grid">
                        {ord.items?.map((item) => (
                          <div key={item.id} className="order-item-row">
                            <img
                              src={item.product_image || '/images/products/placeholder.jpg'}
                              alt={item.product_name}
                              className="order-item-img"
                              onError={(e) => {
                                e.target.src = '/images/logo.png';
                              }}
                            />
                            <div className="order-item-info">
                              <div className="order-item-name">{item.product_name}</div>
                              <div className="order-item-details">
                                {item.size && <span>Size: {item.size} • </span>}
                                <span>Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <div className="order-item-price">
                              {formatPrice(item.total_price)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="order-footer">
                        <span style={{ color: 'var(--color-text-muted)' }}>
                          Payment: {ord.payment_method}
                        </span>
                        <div>
                          <span style={{ marginRight: '0.5rem', color: 'var(--color-text-muted)' }}>Total:</span>
                          <span className="order-total-amount">{formatPrice(ord.total_amount)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-card" style={{ maxWidth: '600px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-burgundy)', marginBottom: '1.5rem' }}>
                Edit Profile Information
              </h2>

              {profileMsg.text && (
                <div className={profileMsg.type === 'success' ? 'auth-success-alert' : 'auth-error-alert'}>
                  {profileMsg.text}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="auth-form">
                <div className="auth-field-group">
                  <label htmlFor="profile-fullname" className="auth-label">
                    Full Name
                  </label>
                  <input
                    id="profile-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="auth-input"
                    required
                  />
                </div>

                <div className="auth-field-group">
                  <label htmlFor="profile-email-ro" className="auth-label">
                    Email Address (Account Identifier)
                  </label>
                  <input
                    id="profile-email-ro"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="auth-input"
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                  />
                </div>

                <div className="auth-field-group">
                  <label htmlFor="profile-phone" className="auth-label">
                    Phone Number
                  </label>
                  <input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="auth-input"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(74, 23, 28, 0.1)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-burgundy)', marginBottom: '1rem' }}>
                    Change Password (Optional)
                  </h3>

                  <div className="auth-field-group" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="profile-curr-pw" className="auth-label">
                      Current Password
                    </label>
                    <input
                      id="profile-curr-pw"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="auth-input"
                      placeholder="Required only if setting new password"
                    />
                  </div>

                  <div className="auth-field-group">
                    <label htmlFor="profile-new-pw" className="auth-label">
                      New Password
                    </label>
                    <input
                      id="profile-new-pw"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="auth-input"
                      placeholder="Min 8 characters with letters & numbers"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={savingProfile}
                  style={{ marginTop: '1rem' }}
                >
                  {savingProfile ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save Profile Changes</span>
                  )}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
