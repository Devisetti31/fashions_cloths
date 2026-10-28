import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import SystemHealthModal from './components/SystemHealthModal';
import Toast from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CategoryPage from './pages/CategoryPage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';

import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import { fetchHealthStatus } from './services/api';
import './styles/index.css';

export default function App() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const checkHealth = useCallback(async () => {
    setIsRefreshing(true);
    const result = await fetchHealthStatus();
    setHealthStatus(result);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return (
    <AuthProvider>
      <ShopProvider>
        <ScrollToTop />
        <div className="app-layout">
          {/* Global Boutique Header (Clean, elegant, no marketing bar, no API Live badge) */}
          <Header
            onOpenSearch={() => setIsSearchOpen(true)}
          />

          {/* Application Page Routing */}
          <main id="main-content" role="main">
            <Routes>
              {/* Storefront Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/new-arrivals" element={<NewArrivalsPage />} />
              <Route path="/category/new-arrivals" element={<NewArrivalsPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Legal & Policy Routes */}
              <Route path="/privacy-policy" element={<LegalPage />} />
              <Route path="/terms" element={<LegalPage />} />
              <Route path="/shipping-policy" element={<LegalPage />} />
              <Route path="/refund-policy" element={<LegalPage />} />

              {/* Customer Authentication & Account Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/orders"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />

              {/* Administrator Authentication & Protected Dashboard Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard defaultTab="overview" />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminDashboard defaultTab="products" />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <AdminDashboard defaultTab="orders" />
                  </AdminRoute>
                }
              />

              {/* Branded 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Persistent Overlays */}
          <CartDrawer />
          <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

          <SystemHealthModal
            isOpen={isHealthModalOpen}
            onClose={() => setIsHealthModalOpen(false)}
            healthStatus={healthStatus}
            onRefresh={checkHealth}
            isRefreshing={isRefreshing}
          />

          <Toast />

          {/* Global Boutique Footer */}
          <Footer onOpenHealthModal={() => setIsHealthModalOpen(true)} />
        </div>
      </ShopProvider>
    </AuthProvider>
  );
}
