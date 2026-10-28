import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './CartDrawer.css';

export default function CartDrawer() {
  const { isCartOpen, closeCart, cart, cartCount, cartSubtotal, updateQuantity, removeFromCart, formatPrice } =
    useShop();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div
      className="cart-drawer-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      onClick={closeCart}
    >
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-group">
            <h2 id="cart-drawer-title" className="cart-drawer-title">
              Shopping Bag
            </h2>
            <span className="cart-drawer-count">({cartCount} items)</span>
          </div>

          <button
            type="button"
            className="cart-close-btn"
            onClick={closeCart}
            aria-label="Close Shopping Bag Drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="cart-drawer-items">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">
                <ShoppingBag size={28} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)', fontSize: '1.25rem' }}>
                Your bag is currently empty
              </h3>
              <p style={{ fontSize: '0.9rem', maxWidth: '280px' }}>
                Discover our curated heritage handlooms, royal lehengas, and artisanal kurtis.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  closeCart();
                  navigate('/shop');
                }}
              >
                <span>Explore The Collection</span>
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item-row">
                <div className="cart-item-thumb">
                  <img
                    src={item.product.images && item.product.images[0]}
                    alt={item.product.name}
                    className="cart-item-img"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                <div className="cart-item-details">
                  <h4 className="cart-item-name">{item.product.name}</h4>
                  <div className="cart-item-variant">
                    Size: <strong>{item.size}</strong> &bull; Color: {item.color.name}
                  </div>
                  <div className="cart-item-price">{formatPrice(item.product.price)}</div>

                  <div className="cart-item-controls">
                    <div className="qty-pill">
                      <button
                        type="button"
                        className="qty-btn"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Actions */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal-row">
              <span>Estimated Subtotal</span>
              <span className="cart-subtotal-val">{formatPrice(cartSubtotal)}</span>
            </div>

            <div className="cart-actions-col">
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  closeCart();
                  navigate('/cart');
                }}
              >
                <span>Proceed to Bag &amp; Review</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.85rem', padding: '0.65rem' }}
                onClick={closeCart}
              >
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
