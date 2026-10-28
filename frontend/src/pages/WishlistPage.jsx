import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { PRODUCTS } from '../data/products';
import { useShop } from '../context/ShopContext';
import './ShopPage.css';

export default function WishlistPage() {
  const { wishlist, wishlistCount, toggleWishlist, addToCart, formatPrice } = useShop();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="shop-page">
      {/* Banner */}
      <section className="shop-banner">
        <h1 className="shop-banner-title">My Saved Heirlooms</h1>
        <p className="shop-banner-subtitle">
          Your Curated Private Wishlist &bull; {wishlistCount} Selected Items
        </p>
      </section>

      <div className="shop-container">
        {wishlistedProducts.length === 0 ? (
          <div className="shop-empty-state">
            <div className="shop-empty-icon" aria-hidden="true">
              <Heart size={30} />
            </div>
            <h2 className="shop-empty-title">Your Wishlist is Empty</h2>
            <p className="shop-empty-text">
              Save your favorite handloom sarees, regal bridal lehengas, and festive kurtis to
              revisit them for your upcoming celebrations.
            </p>
            <Link to="/shop" className="btn btn-primary">
              <span>Explore The Boutique</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <span style={{ fontSize: '1rem', color: 'var(--color-burgundy)', fontWeight: 600 }}>
                {wishlistedProducts.length} Saved Silhouettes
              </span>
              <Link to="/shop" style={{ fontSize: '0.85rem', color: 'var(--color-antique-gold)', fontWeight: 600, textDecoration: 'underline' }}>
                Continue Browsing
              </Link>
            </div>

            <div className="products-grid">
              {wishlistedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
