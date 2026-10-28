import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock the backend API services
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

describe('ES ETHNIC STYLES — UI Cleanup & Authentication Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('verifies the top announcement bar is completely removed from the DOM', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
    });

    expect(screen.queryByText(/DEMO STOREFRONT/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Curated Haute Couture & Master Handlooms/i)
    ).not.toBeInTheDocument();
  });

  it('verifies the API Live status badge is completely removed from header navigation', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
    });

    expect(screen.queryByText(/API Live/i)).not.toBeInTheDocument();
  });

  it('renders customer login page with required form controls', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      );
    });

    expect(screen.getByRole('heading', { name: /Welcome to the Atelier/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Sign In$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Create Patron Account/i })).toBeInTheDocument();
  });

  it('renders customer registration page with required fields and policies', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/register']}>
          <App />
        </MemoryRouter>
      );
    });

    expect(screen.getByRole('heading', { name: /Create Patron Account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Minimum 8 characters with letters & numbers/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Re-enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Complete Registration/i })).toBeInTheDocument();
  });

  it('renders dedicated administrator login portal at /admin/login', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/admin/login']}>
          <App />
        </MemoryRouter>
      );
    });

    expect(screen.getByRole('heading', { name: /Atelier Director Portal/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Admin Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter administrator password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enter Administration/i })).toBeInTheDocument();
  });

  it('redirects unauthenticated patrons trying to access /account to /login', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/account']}>
          <App />
        </MemoryRouter>
      );
    });

    // Should redirect to login
    expect(screen.getByRole('heading', { name: /Welcome to the Atelier/i })).toBeInTheDocument();
  });
});
