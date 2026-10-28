import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, CheckCircle2, Loader2, PackageCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/authService';
import './CartPage.css';

export default function CartPage() {
  const { cart, cartCount, cartSubtotal, updateQuantity, removeFromCart, clearCart, formatPrice } =
    useShop();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoMessage, setPromoMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'WELCOME10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setDiscountAmount(discount);
      setPromoMessage({ success: true, text: 'Privileged code WELCOME10 applied (10% patronage gift)!' });
    } else {
      setPromoMessage({ success: false, text: 'Please enter a valid concierge code: WELCOME10' });
    }
  };

  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    try {
      setIsSubmitting(true);
      setCheckoutError('');

      const orderPayload = {
        items: cart.map((item) => ({
          product_id: typeof item.id === 'number' ? item.id : undefined,
          product_name: item.name,
          product_image: item.primaryImage || item.image,
          size: item.selectedSize || 'Free Size',
          color: item.selectedColor || null,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        shipping_address: {
          fullName: user.full_name,
          street: 'Boutique Residence Delivery',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
        },
        contact_phone: user.phone_number || undefined,
        payment_method: 'Complimentary Patron Credit',
        notes: promoCode ? `Promo Code: ${promoCode}` : undefined,
      };

      const orderResult = await createOrder(orderPayload);
      setPlacedOrder(orderResult);
      clearCart();
    } catch (err) {
      setCheckoutError(err.message || 'Unable to finalize order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="cart-page">
        <div className="cart-container" style={{ textAlign: 'center', padding: '5rem 1rem', maxWidth: '640px' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              border: '1px solid #bbf7d0',
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)', fontSize: '2.4rem', marginBottom: '0.75rem' }}>
            Couture Order Confirmed
          </h1>

          <p style={{ color: 'var(--color-antique-gold)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            Order #{placedOrder.order_number}
          </p>

          <p style={{ color: 'var(--color-text-muted)', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Thank you, <strong>{user?.full_name}</strong>. Your artisanal garments are now registered in our atelier
            production registry. We have dispatched a confirmation to <strong>{user?.email}</strong>.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/account" className="btn btn-primary">
              <PackageCheck size={18} style={{ marginRight: '6px' }} />
              <span>Track In My Orders</span>
            </Link>
            <Link to="/shop" className="btn btn-secondary">
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">Your Shopping Bag</h1>
          <p className="cart-subtitle">
            {cartCount === 0
              ? 'Your bespoke bag is currently empty.'
              : `Reviewing ${cartCount} bespoke ${cartCount === 1 ? 'creation' : 'creations'}`}
          </p>
        </div>

        {checkoutError && (
          <div className="auth-error-alert" style={{ marginBottom: '1.5rem' }}>
            {checkoutError}
          </div>
        )}

        {cart.length === 0 ? (
          <div className="cart-empty-state">
            <div className="cart-empty-icon">
              <ShoppingBag size={48} />
            </div>
            <h2 className="cart-empty-title">Your Wardrobe Awaits</h2>
            <p className="cart-empty-desc">
              Discover authentic handwoven Banarasi brocades, Kanchipuram silks, and bespoke bridal lehengas.
            </p>
            <Link to="/shop" className="btn btn-primary">
              <span>Explore Boutique Collection</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="cart-layout-grid">
            {/* Bag Line Items */}
            <div className="cart-items-column">
              <div className="cart-items-header">
                <span>Garment</span>
                <span>Quantity</span>
                <span style={{ textAlign: 'right' }}>Total</span>
              </div>

              <div className="cart-items-list">
                {cart.map((item) => {
                  const itemKey = `${item.id}-${item.selectedSize || item.size || 'default'}-${item.selectedColor?.name || item.color?.name || item.selectedColor || 'default'}`;
                  const rawPrice = item.price ?? item.product?.price ?? 0;
                  const numPrice = Number(rawPrice) || 0;
                  const itemQty = Math.max(1, Number(item.quantity) || 1);
                  const itemTotal = numPrice * itemQty;
                  const itemName = item.name || item.product?.name || 'Couture';
                  const itemImage = item.primaryImage || item.image || item.product?.primary_image || item.product?.images?.[0] || '/images/logo.png';
                  const itemCategory = item.categoryLabel || item.product?.categoryLabel || 'Couture';
                  const itemSize = item.selectedSize || item.size;
                  const itemColor = typeof item.selectedColor === 'object' ? item.selectedColor?.name : (item.selectedColor || (typeof item.color === 'object' ? item.color?.name : item.color));

                  return (
                    <div key={itemKey} className="cart-item-card">
                      <div className="cart-item-product">
                        <Link to={`/product/${item.product?.id || item.id}`} className="cart-item-img-link">
                          <img
                            src={itemImage}
                            alt={itemName}
                            className="cart-item-img"
                            onError={(e) => {
                              e.target.src = '/images/logo.png';
                            }}
                          />
                        </Link>
                        <div className="cart-item-details">
                          <span className="cart-item-category">{itemCategory}</span>
                          <Link to={`/product/${item.product?.id || item.id}`} className="cart-item-name">
                            {itemName}
                          </Link>
                          <div className="cart-item-variants">
                            {itemSize && <span>Size: {itemSize}</span>}
                            {itemColor && <span>Color: {itemColor}</span>}
                          </div>
                          <div className="cart-item-unit-price">{formatPrice(numPrice)}</div>
                        </div>
                      </div>

                      <div className="cart-item-qty">
                        <div className="qty-control">
                          <button
                            type="button"
                            className="qty-btn"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.id, itemQty - 1, itemSize, itemColor)}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="qty-val">{itemQty}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.id, itemQty + 1, itemSize, itemColor)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="cart-item-remove"
                          onClick={() => removeFromCart(item.id, itemSize, itemColor)}
                          aria-label={`Remove ${itemName} from bag`}
                        >
                          <Trash2 size={15} />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="cart-item-total">{formatPrice(itemTotal)}</div>
                    </div>
                  );
                })}
              </div>

              <div className="cart-actions-row">
                <Link to="/shop" className="btn btn-secondary">
                  <span>Continue Browsing</span>
                </Link>
                <button type="button" className="cart-clear-btn" onClick={clearCart}>
                  Clear Shopping Bag
                </button>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="cart-summary-card">
              <h2 className="summary-title">Summary &amp; Checkout</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row" style={{ color: 'var(--color-status-healthy)' }}>
                  <span>Patronage Privilege</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Complimentary Delivery</span>
                <span>Free</span>
              </div>

              {/* Promo Input */}
              <form onSubmit={handleApplyPromo} className="promo-form">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Concierge Code (WELCOME10)"
                  className="promo-input"
                  aria-label="Promotional Code"
                />
                <button type="submit" className="promo-btn">
                  Apply
                </button>
              </form>

              {promoMessage && (
                <div style={{ fontSize: '0.8rem', color: promoMessage.success ? 'var(--color-status-healthy)' : '#B91C1C' }}>
                  {promoMessage.text}
                </div>
              )}

              <div className="summary-total-row">
                <span>Estimated Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem' }}
                onClick={handleCheckout}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>{isAuthenticated ? 'Place Couture Order' : 'Sign In & Checkout'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
