import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import NewArrivalsPage from '../pages/NewArrivalsPage';
import { ShopProvider } from '../context/ShopContext';
import * as productService from '../services/productService';

vi.mock('../services/api', () => ({
  fetchHealthStatus: vi.fn(() =>
    Promise.resolve({
      ok: true,
      data: { status: 'healthy', app_name: 'ES ETHNIC STYLES' },
    })
  ),
}));

describe('ES ETHNIC STYLES — New Arrivals Navigation & Listing Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('verifies Sarees, Kurtis, and Lehengas are removed and New Arrivals is displayed in the primary navbar', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
    });

    const primaryNav = screen.getByRole('navigation', { name: /Primary Navigation/i });
    expect(primaryNav).toBeInTheDocument();

    // Verify New Arrivals is visible
    expect(screen.getByRole('link', { name: /^New Arrivals$/i })).toBeInTheDocument();

    // Verify Sarees, Kurtis, and Lehengas do not exist in the navbar
    const sareeLink = screen.queryByRole('link', { name: /^Sarees$/i });
    const kurtiLink = screen.queryByRole('link', { name: /^Kurtis$/i });
    const lehengaLink = screen.queryByRole('link', { name: /^Lehengas$/i });

    expect(sareeLink).toBeNull();
    expect(kurtiLink).toBeNull();
    expect(lehengaLink).toBeNull();

    // Verify existing options remain intact
    expect(screen.getAllByRole('link', { name: /^Home$/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /^Shop All$/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /^Festive Wear$/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /^About$/i })[0]).toBeInTheDocument();
  });

  it('renders New Arrivals page with products ordered by newest first from database API', async () => {
    const mockNewArrivals = [
      {
        id: 'db-prod-12',
        name: 'Deep Plum Brocade Royal Festive Lehenga',
        price: 52000,
        originalPrice: null,
        primary_image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261',
        images: ['https://images.unsplash.com/photo-1594552072238-b8a33785b261'],
        fabric: 'Pure Silk Brocade',
        craft: 'Varanasi Brocade',
        sizes: ['XS', 'S', 'M', 'L'],
        created_at: '2026-10-27T10:04:21.843240',
      },
      {
        id: 'db-prod-11',
        name: 'Mustard Marigold Raw Silk Festive Kurta Set',
        price: 13500,
        originalPrice: 15500,
        primary_image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b',
        images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b'],
        fabric: 'Raw Silk',
        craft: 'Gota Patti Needlework',
        sizes: ['S', 'M', 'L', 'XL'],
        created_at: '2026-10-27T10:04:21.840758',
      },
    ];

    vi.spyOn(productService, 'fetchNewArrivals').mockResolvedValueOnce({
      products: mockNewArrivals,
      total: 2,
      page: 1,
      totalPages: 1,
      isFromApi: true,
    });

    await act(async () => {
      render(
        <ShopProvider>
          <MemoryRouter initialEntries={['/new-arrivals']}>
            <NewArrivalsPage />
          </MemoryRouter>
        </ShopProvider>
      );
    });

    // Check heading & badge
    expect(screen.getByRole('heading', { name: /^New Arrivals$/i })).toBeInTheDocument();
    expect(screen.getByText(/Sorted: Newest First/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Showing 2 Heirloom Silhouettes/i)).toBeInTheDocument();

    // Check products displayed in order
    const titles = screen.getAllByRole('link', { name: /Deep Plum Brocade|Mustard Marigold/i });
    expect(titles.length).toBeGreaterThanOrEqual(2);
    expect(titles[0]).toHaveTextContent(/Deep Plum Brocade Royal Festive Lehenga/i);

    // Verify sizes/variants indicator
    expect(screen.getAllByText(/^XS$/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/^S$/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders clean, attractive empty state when no products are available', async () => {
    vi.spyOn(productService, 'fetchNewArrivals').mockResolvedValueOnce({
      products: [],
      total: 0,
      page: 1,
      totalPages: 0,
      isFromApi: true,
    });

    await act(async () => {
      render(
        <ShopProvider>
          <MemoryRouter initialEntries={['/new-arrivals']}>
            <NewArrivalsPage />
          </MemoryRouter>
        </ShopProvider>
      );
    });

    expect(screen.getByRole('heading', { name: /Fresh Heirlooms Arriving Soon/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Browse All Silhouettes/i })).toHaveAttribute('href', '/shop');
  });

  it('allows adding a new arrival to the wishlist directly from the page', async () => {
    const mockProduct = {
      id: 'db-prod-12',
      name: 'Deep Plum Brocade Royal Festive Lehenga',
      price: 52000,
      primary_image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261',
      images: ['https://images.unsplash.com/photo-1594552072238-b8a33785b261'],
      fabric: 'Pure Silk Brocade',
      sizes: ['XS', 'S'],
      created_at: '2026-10-27T10:04:21.843240',
    };

    vi.spyOn(productService, 'fetchNewArrivals').mockResolvedValueOnce({
      products: [mockProduct],
      total: 1,
      page: 1,
      totalPages: 1,
      isFromApi: true,
    });

    await act(async () => {
      render(
        <ShopProvider>
          <MemoryRouter initialEntries={['/new-arrivals']}>
            <NewArrivalsPage />
          </MemoryRouter>
        </ShopProvider>
      );
    });

    const wishlistBtn = screen.getByLabelText(new RegExp(`Save ${mockProduct.name} to Wishlist`, 'i'));
    expect(wishlistBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(wishlistBtn);
    });

    const activeWishlistBtn = screen.getByLabelText(new RegExp(`Remove ${mockProduct.name} from Wishlist`, 'i'));
    expect(activeWishlistBtn).toBeInTheDocument();
  });
});
