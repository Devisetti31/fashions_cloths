import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { PRODUCTS } from '../data/products';
import { adaptApiProduct } from '../services/productService';
import { useShop } from '../context/ShopContext';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart, isInWishlist, toggleWishlist, formatPrice, products } = useShop();

  const sourceProducts = products && products.length > 0 ? products : PRODUCTS;
  const initialProduct = sourceProducts.find(
    (p) => p.id === id || p.slug === id || String(p.id) === String(id) || String(p.dbId) === String(id) || p.sku === id
  );
  const [apiProduct, setApiProduct] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/v1/products/${id}`)
        .then((res) => (res.ok ? res.json() : fetch(`/api/v1/products/slug/${id}`).then((r) => (r.ok ? r.json() : null))))
        .then((data) => {
          if (data) setApiProduct(adaptApiProduct(data));
        })
        .catch(() => {});
    }
  }, [id]);

  const product = apiProduct || initialProduct;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({ craft: true, specs: false, care: false });
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Initialize variant defaults when product loads
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setQuantity(1);
      setSizeError(false);
      if (product.sizes && product.sizes.length === 1) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize('');
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      window.scrollTo(0, 0);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)', fontSize: '2.2rem', marginBottom: '1rem' }}>
            Heirloom Silhouette Not Found
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            The requested garment code is not in our active collection.
          </p>
          <Link to="/shop" className="btn btn-primary">
            <span>Return to Boutique Collection</span>
          </Link>
        </div>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const relatedProducts = sourceProducts.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const toggleAccordion = (section) => {
    setOpenAccordions((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="breadcrumb-nav">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <ChevronRight size={13} style={{ color: 'var(--color-antique-gold)' }} />
          <Link to="/shop" className="breadcrumb-link">Shop</Link>
          <ChevronRight size={13} style={{ color: 'var(--color-antique-gold)' }} />
          <Link to={`/category/${product.category}`} className="breadcrumb-link">
            {product.categoryLabel}
          </Link>
          <ChevronRight size={13} style={{ color: 'var(--color-antique-gold)' }} />
          <span className="breadcrumb-current" aria-current="page">{product.name}</span>
        </nav>

        {/* Main Detail Grid */}
        <div className="detail-main-grid">
          {/* Gallery Stack */}
          <div className="detail-gallery">
            <div className="detail-main-media">
              <img
                src={product.images && product.images[activeImageIndex]}
                alt={`${product.name} primary photograph`}
                className="detail-main-img"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="detail-thumbnails-row">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`detail-thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View photo view ${idx + 1}`}
                  >
                    <img src={img} alt="" className="detail-thumb-img" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info & Variants */}
          <div className="detail-info-col">
            <span className="detail-category-badge">{product.categoryLabel} &bull; {product.sku}</span>
            <h1 className="detail-product-title">{product.name}</h1>

            <div className="detail-pricing-row">
              <span className="detail-price-current">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="detail-price-original">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discountPercent && (
                <span className="detail-savings-pill">Save {discountPercent}%</span>
              )}
            </div>

            {/* Fabric Highlight Box */}
            <div className="detail-craft-highlight">
              <div><strong>Fabric:</strong> {product.fabric}</div>
              <div><strong>Craft:</strong> {product.craft}</div>
            </div>

            <p className="detail-description">{product.description}</p>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="variant-block">
                <div className="variant-heading-row">
                  <span>Palette:</span>
                  <span style={{ color: 'var(--color-antique-gold)', fontWeight: 600 }}>
                    {selectedColor?.name || 'Standard'}
                  </span>
                </div>
                <div className="color-swatches-row">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      className={`color-swatch-btn ${selectedColor?.name === c.name ? 'active' : ''}`}
                      style={{ backgroundColor: c.hex }}
                      onClick={() => setSelectedColor(c)}
                      aria-label={`Select ${c.name} color`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Variant Selector */}
            <div className="variant-block">
              <div className="variant-heading-row">
                <span>Select Size:</span>
                <span style={{ color: selectedSize ? 'var(--color-burgundy)' : '#B91C1C', fontWeight: 600 }}>
                  {selectedSize || 'Required Selection'}
                </span>
              </div>

              <div className="size-selector-grid">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className={`size-btn ${selectedSize === sz ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedSize(sz);
                      setSizeError(false);
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {sizeError && (
                <div className="size-required-alert" role="alert">
                  Please select your required garment size before adding to your shopping bag.
                </div>
              )}
            </div>

            {/* Quantity and CTA Buttons */}
            <div className="detail-cta-row">
              <div className="detail-qty-control">
                <button
                  type="button"
                  className="detail-qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="detail-qty-val">{quantity}</span>
                <button
                  type="button"
                  className="detail-qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-add-to-bag"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                <span>Add To Shopping Bag</span>
              </button>

              <button
                type="button"
                className={`btn-wishlist-toggle ${wishlisted ? 'active' : ''}`}
                onClick={() => toggleWishlist(product.id)}
                aria-label={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                title="Save to Wishlist"
              >
                <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Accordions */}
            <div className="detail-accordion">
              <div className="accordion-tab">
                <button
                  type="button"
                  className="accordion-trigger"
                  onClick={() => toggleAccordion('craft')}
                >
                  <span>Artisanal Details &amp; Specifications</span>
                  {openAccordions.craft ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordions.craft && (
                  <div className="accordion-body">
                    <ul className="accordion-list">
                      {product.details.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="accordion-tab">
                <button
                  type="button"
                  className="accordion-trigger"
                  onClick={() => toggleAccordion('specs')}
                >
                  <span>Heirloom Care &amp; Silk Certification</span>
                  {openAccordions.specs ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordions.specs && (
                  <div className="accordion-body">
                    <p>
                      All silk garments at ES ETHNIC STYLES adhere strictly to verified Silk Mark standards.
                      To preserve delicate bullion zaris and hand-embroidered resham threads, strictly dry clean only.
                      Store in the provided breathable cotton/velvet garment cover.
                    </p>
                  </div>
                )}
              </div>

              <div className="accordion-tab">
                <button
                  type="button"
                  className="accordion-trigger"
                  onClick={() => toggleAccordion('care')}
                >
                  <span>Boutique Atelier Fitting &amp; Shipping</span>
                  {openAccordions.care ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordions.care && (
                  <div className="accordion-body">
                    <p>
                      Complimentary virtual measurement consultations are available for all bridal and
                      couture lehenga orders. Each piece is hand-steamed and boxed in our signature
                      burgundy-and-gold presentation packaging.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)', fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
              Complementary Atelier Silhouettes
            </h2>
            <div className="products-grid">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          </div>
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
