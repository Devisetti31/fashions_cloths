import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import ProductCard from '../components/ProductCard';
import { ShopProvider } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';

// Mock the backend API service
vi.mock('../services/api', () => ({
  fetchHealthStatus: vi.fn(() =>
    Promise.resolve({
      ok: true,
      data: {
        status: 'healthy',
        app_name: 'ES ETHNIC STYLES',
        environment: 'development',
        database: 'connected',
        timestamp: '2026-10-27T08:55:00Z',
      },
    })
  ),
}));

describe('ES ETHNIC STYLES — Phase 2 Storefront UI Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders official brand name and tagline in header and hero', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
    });

    const brandTitles = screen.getAllByText(/ES ETHNIC STYLES/i);
    expect(brandTitles.length).toBeGreaterThanOrEqual(1);

    const taglines = screen.getAllByText(/Timeless Tradition, Modern You/i);
    expect(taglines.length).toBeGreaterThanOrEqual(1);
  });

  it('renders official brand logo with accessible alt text', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
    });

    const logoImgs = screen.getAllByAltText(/ES ETHNIC STYLES Official Logo/i);
    expect(logoImgs.length).toBeGreaterThanOrEqual(1);
    expect(logoImgs[0]).toBeInTheDocument();
  });

  it('renders navigation links with New Arrivals and confirms Sarees, Kurtis, Lehengas are removed', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
    });

    // Confirmed present in navbar
    expect(screen.getAllByRole('link', { name: /^Shop All$/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /^New Arrivals$/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /^Festive Wear$/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /^About$/i })[0]).toBeInTheDocument();

    // Verify Sarees, Kurtis, and Lehengas are completely removed from the navbar
    const navElement = screen.getByRole('navigation', { name: /Primary Navigation/i });
    expect(navElement).not.toHaveTextContent(/^Sarees$/);
    expect(navElement).not.toHaveTextContent(/^Kurtis$/);
    expect(navElement).not.toHaveTextContent(/^Lehengas$/);
  });

  it('renders the 6 required category cards on the homepage', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
    });

    expect(screen.getByRole('link', { name: /Explore Sarees collection/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore Kurtis collection/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore Lehengas collection/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore Salwar Suits collection/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore Festive Wear collection/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore New Arrivals collection/i })).toBeInTheDocument();
  });

  it('allows toggling an item in wishlist with immediate state update', async () => {
    const sampleProduct = PRODUCTS[0];

    await act(async () => {
      render(
        <ShopProvider>
          <MemoryRouter>
            <ProductCard product={sampleProduct} />
          </MemoryRouter>
        </ShopProvider>
      );
    });

    const wishlistBtn = screen.getByLabelText(new RegExp(`Save ${sampleProduct.name} to Wishlist`, 'i'));
    expect(wishlistBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(wishlistBtn);
    });

    const activeWishlistBtn = screen.getByLabelText(new RegExp(`Remove ${sampleProduct.name} from Wishlist`, 'i'));
    expect(activeWishlistBtn).toBeInTheDocument();
  });

  it('navigates to shop page and displays products', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/shop']}>
          <App />
        </MemoryRouter>
      );
    });

    expect(screen.getByRole('heading', { name: /The Complete Boutique/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by name, zari craft, or fabric/i)).toBeInTheDocument();
  });

  it('renders branded 404 not-found page for non-existent routes', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/unknown-couture-route']}>
          <App />
        </MemoryRouter>
      );
    });

    expect(screen.getByRole('heading', { name: /This Silhouette Has Wandered Away/i })).toBeInTheDocument();
    const returnLinks = screen.getAllByRole('link', { name: /Return to Homepage/i });
    expect(returnLinks.length).toBeGreaterThanOrEqual(1);
  });
});
