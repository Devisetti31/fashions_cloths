import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Heart,
  ShoppingBag,
  Search,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Package,
  UserPlus,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header({ onOpenSearch }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  const { cartCount, wishlistCount, openCart } = useShop();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Close account dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop All' },
    { to: '/new-arrivals', label: 'New Arrivals' },
    { to: '/category/festive-wear', label: 'Festive Wear' },
    { to: '/about', label: 'About' },
  ];

  const handleLogout = () => {
    setAccountMenuOpen(false);
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="site-header" role="banner">
      <div className="header-main">
        {/* Brand Logo & Name */}
        <Link to="/" className="brand-link" aria-label="ES ETHNIC STYLES — Return to Homepage">
          <div className="brand-logo-container" title="ES ETHNIC STYLES Official Logo">
            {!logoFailed ? (
              <img
                src="/images/logo.png"
                alt="ES ETHNIC STYLES Official Logo"
                className="brand-logo-img"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <div className="brand-logo-fallback">
                <span className="brand-logo-monogram">ES</span>
                <span className="brand-logo-border" />
              </div>
            )}
          </div>
          <div className="brand-text-block">
            <span className="brand-title">ES ETHNIC STYLES</span>
            <span className="brand-tagline">Timeless Tradition, Modern You</span>
          </div>
        </Link>

        {/* Desktop Primary Navigation */}
        <nav className="nav-menu" role="navigation" aria-label="Primary Navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Controls & Authentication Access */}
        <div className="header-actions">
          {/* Search Trigger */}
          <button
            type="button"
            className="action-btn"
            aria-label="Search collection"
            title="Search collection"
            onClick={onOpenSearch}
          >
            <Search size={18} />
          </button>

          {/* Customer Login / Account Menu */}
          <div className="account-dropdown-wrapper" ref={accountMenuRef}>
            <button
              type="button"
              className={`header-account-btn ${isAuthenticated ? 'is-authenticated' : ''}`}
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              aria-label={
                isAuthenticated
                  ? `Customer Account for ${user?.full_name}`
                  : 'Customer Login / Account Menu'
              }
              aria-expanded={accountMenuOpen}
              title={isAuthenticated ? `Account (${user?.full_name})` : 'Customer Sign In'}
            >
              <User size={17} />
              <span className="header-account-label">
                {isAuthenticated ? user?.full_name?.split(' ')[0] || 'Account' : 'Login'}
              </span>
              <ChevronDown size={13} className={`chevron-icon ${accountMenuOpen ? 'open' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {accountMenuOpen && (
              <div className="header-dropdown-menu" role="menu">
                {isAuthenticated ? (
                  <>
                    <div className="dropdown-user-greeting">
                      <span className="greeting-label">Signed in as</span>
                      <strong className="greeting-name">{user?.full_name}</strong>
                      <span className="greeting-email">{user?.email}</span>
                    </div>

                    <Link
                      to="/account"
                      className="dropdown-menu-item"
                      role="menuitem"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      <User size={15} />
                      <span>My Profile &amp; Wardrobe</span>
                    </Link>

                    <Link
                      to="/account/orders"
                      className="dropdown-menu-item"
                      role="menuitem"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      <Package size={15} />
                      <span>My Orders</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="dropdown-menu-item dropdown-admin-item"
                        role="menuitem"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        <ShieldCheck size={15} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="dropdown-divider" />

                    <button
                      type="button"
                      className="dropdown-menu-item dropdown-logout-btn"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="dropdown-header-note">
                      <span>Boutique Patron Access</span>
                    </div>

                    <Link
                      to="/login"
                      className="dropdown-menu-item highlight-item"
                      role="menuitem"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      <User size={15} />
                      <span>Customer Sign In</span>
                    </Link>

                    <Link
                      to="/register"
                      className="dropdown-menu-item"
                      role="menuitem"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      <UserPlus size={15} />
                      <span>Create Account</span>
                    </Link>

                    <div className="dropdown-divider" />

                    <Link
                      to="/admin/login"
                      className="dropdown-menu-item dropdown-admin-item"
                      role="menuitem"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      <ShieldCheck size={15} />
                      <span>Admin Login</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Separate Distinct Administrator Access Pill */}
          <Link
            to={isAdmin ? '/admin' : '/admin/login'}
            className="header-admin-pill"
            title="Executive Administrator Portal"
            aria-label="Executive Administrator Portal"
          >
            <ShieldCheck size={14} />
            <span className="admin-pill-text">Admin</span>
          </Link>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="action-btn"
            aria-label={`View Wishlist (${wishlistCount} items saved)`}
            title="Wishlist"
          >
            <Heart size={18} />
            {wishlistCount > 0 && <span className="action-badge badge-gold">{wishlistCount}</span>}
          </Link>

          {/* Shopping Bag Trigger */}
          <button
            type="button"
            className="action-btn"
            aria-label={`Shopping Bag (${cartCount} items selected)`}
            title="Shopping Bag"
            onClick={openCart}
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="action-badge">{cartCount}</span>}
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            className="action-btn menu-toggle-btn"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-label="Mobile Navigation Menu">
          <ul className="mobile-nav-menu">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}

            {/* Mobile Authentication Options */}
            <li className="mobile-nav-section-title">Patron Account</li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/account"
                    className="mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>My Profile ({user?.full_name})</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account/orders"
                    className="mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>My Orders</span>
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    className="mobile-nav-link"
                    style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#b91c1c' }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                  >
                    <span>Sign Out</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="mobile-nav-link mobile-login-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Customer Sign In</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Register New Account</span>
                  </Link>
                </li>
              </>
            )}

            {/* Mobile Separate Administrator Login */}
            <li className="mobile-nav-section-title">Management</li>
            <li>
              <Link
                to={isAdmin ? '/admin' : '/admin/login'}
                className="mobile-nav-link mobile-admin-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{isAdmin ? 'Admin Dashboard' : 'Admin Login (Staff Only)'}</span>
                <ShieldCheck size={16} />
              </Link>
            </li>

            <li className="mobile-nav-section-title">Saved Items</li>
            <li>
              <Link
                to="/wishlist"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Wishlist</span>
                <span>({wishlistCount})</span>
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="mobile-nav-link"
                style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCart();
                }}
              >
                <span>Shopping Bag</span>
                <span>({cartCount})</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
