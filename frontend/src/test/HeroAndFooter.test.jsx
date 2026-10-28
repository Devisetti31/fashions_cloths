import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { BUSINESS_CONFIG, getWhatsAppUrl, getTelephoneUrl, getMailtoUrl } from '../config/business';

vi.mock('../services/api', () => ({
  fetchHealthStatus: vi.fn(() =>
    Promise.resolve({
      ok: true,
      data: {
        status: 'healthy',
        app_name: 'ES ETHNIC STYLES',
      },
    })
  ),
}));

vi.mock('../services/authService', () => ({
  loginUser: vi.fn(),
  registerCustomer: vi.fn(),
  fetchCurrentProfile: vi.fn(() => Promise.reject(new Error('No session'))),
  fetchMyOrders: vi.fn(() => Promise.resolve([])),
  fetchAdminMetrics: vi.fn(() =>
    Promise.resolve({
      total_products: 12,
      total_orders: 5,
      total_revenue: 125000,
      total_customers: 8,
      recent_orders: [],
    })
  ),
  fetchAdminOrders: vi.fn(() => Promise.resolve([])),
  fetchAdminProducts: vi.fn(() => Promise.resolve([])),
}));

describe('ES ETHNIC STYLES — Hero Video, Navigation & Footer Enhancements Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders compact hero with promotional fashion video and controls', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
    });

    // Check main hero heading & tagline
    expect(screen.getByRole('heading', { name: /Where Heritage Meets/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Timeless Tradition, Modern You/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('link', { name: /Shop Collection/i })).toBeInTheDocument();

    // Check video element attributes (muted, loop, playsinline, poster)
    const videoEl = document.querySelector('video.hero-video-player');
    expect(videoEl).toBeInTheDocument();
    expect(videoEl).toHaveAttribute('loop');
    expect(videoEl).toHaveAttribute('playsinline');
    expect(videoEl.muted).toBe(true);
    expect(videoEl).toHaveAttribute('poster');

    // Check play/pause toggle button
    const toggleBtn = screen.getByRole('button', { name: /Pause promotional video/i });
    expect(toggleBtn).toBeInTheDocument();
  });

  it('renders Customer Login/Account and distinct Admin Login in header navbar', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
    });

    // Main navigation contains customer login / account menu button
    const accountBtn = screen.getByRole('button', { name: /Customer Login \/ Account Menu/i });
    expect(accountBtn).toBeInTheDocument();
    expect(screen.getByText(/^Login$/i)).toBeInTheDocument();

    // Main navigation contains separate, clearly-labeled Admin Login link
    const adminLoginLinks = screen.getAllByRole('link', { name: /^Executive Administrator Portal$/i });
    expect(adminLoginLinks.length).toBeGreaterThanOrEqual(1);
    expect(adminLoginLinks[0]).toHaveAttribute('href', '/admin/login');
  });

  it('renders customer account dropdown options when clicking Account', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
    });

    const accountBtn = screen.getByRole('button', { name: /Customer Login \/ Account Menu/i });
    await act(async () => {
      fireEvent.click(accountBtn);
    });

    // Dropdown contains Customer Sign In and Create Account links with menuitem roles
    expect(screen.getByRole('menuitem', { name: /Customer Sign In/i })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('menuitem', { name: /Create Account/i })).toHaveAttribute('href', '/register');
  });

  it('redesigns footer with customer support, WhatsApp, tel, email, and social links', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
    });

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();

    // Customer Support links
    const expectedWaUrl = getWhatsAppUrl();
    const waLinks = screen.getAllByRole('link', { name: new RegExp(BUSINESS_CONFIG.contact.phoneRaw, 'i') });
    expect(waLinks.length).toBeGreaterThanOrEqual(1);
    expect(waLinks[0]).toHaveAttribute('href', expectedWaUrl);

    // Call Us link
    const callLink = footer.querySelector('a[href^="tel:"]');
    expect(callLink).toBeInTheDocument();
    expect(callLink).toHaveAttribute('href', getTelephoneUrl());

    // Email Support link
    const emailLink = footer.querySelector('a[href^="mailto:"]');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', getMailtoUrl());

    // Contact Desk link
    const contactLinks = screen.getAllByRole('link', { name: /Contact/i });
    expect(contactLinks.length).toBeGreaterThanOrEqual(1);

    // Social links (Instagram & WhatsApp)
    const instaLink = screen.getByRole('link', { name: /Follow ES ETHNIC STYLES on Instagram/i });
    expect(instaLink).toHaveAttribute('href', BUSINESS_CONFIG.social.instagramUrl);
    expect(instaLink).toHaveAttribute('target', '_blank');
    expect(instaLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Legal policy links
    expect(screen.getByRole('link', { name: /^Privacy Policy$/i })).toHaveAttribute('href', '/privacy-policy');
    expect(screen.getByRole('link', { name: /^Terms and Conditions$/i })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: /^Shipping Policy$/i })).toHaveAttribute('href', '/shipping-policy');
    expect(screen.getByRole('link', { name: /^Return and Refund Policy$/i })).toHaveAttribute('href', '/refund-policy');
  });

  it('verifies footer DOES NOT contain any customer login, registration, or admin links', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
    });

    const footer = screen.getByRole('contentinfo');

    // Query for any login or register links inside the footer
    const footerLoginLink = footer.querySelector('a[href="/login"]');
    const footerRegisterLink = footer.querySelector('a[href="/register"]');
    const footerAdminLink = footer.querySelector('a[href="/admin/login"]');
    const footerAdminDashLink = footer.querySelector('a[href="/admin"]');

    expect(footerLoginLink).toBeNull();
    expect(footerRegisterLink).toBeNull();
    expect(footerAdminLink).toBeNull();
    expect(footerAdminDashLink).toBeNull();
  });

  it('renders dedicated Contact Page at /contact with working concierge channels', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/contact']}>
          <App />
        </MemoryRouter>
      );
    });

    expect(screen.getByRole('heading', { name: /Contact & Customer Care/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Radhika Merchant/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name@domain.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Transmit to Concierge/i })).toBeInTheDocument();
  });

  it('renders Legal Policies Page with policy switcher at /privacy-policy and /terms', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/privacy-policy']}>
          <App />
        </MemoryRouter>
      );
    });

    expect(screen.getByRole('heading', { name: /Privacy Policy/i })).toBeInTheDocument();
    expect(screen.getByText(/we respect the sanctity of our patrons' personal data/i)).toBeInTheDocument();
  });
});
