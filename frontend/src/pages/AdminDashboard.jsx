import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  DollarSign,
  Users,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import {
  fetchAdminMetrics,
  fetchAdminOrders,
  updateAdminOrderStatus,
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from '../services/authService';
import './Admin.css';

export default function AdminDashboard({ defaultTab }) {
  const { user, logout } = useAuth();
  const { refreshProducts } = useShop();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial tab from route or prop
  const getInitialTab = () => {
    if (defaultTab) return defaultTab;
    if (location.pathname.includes('/products')) return 'products';
    if (location.pathname.includes('/orders')) return 'orders';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compare_at_price: '',
    sku: '',
    category_id: 1,
    primary_image: '',
    fabric: '',
    craft: '',
    is_active: true,
    is_featured: false,
  });
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const [metricsData, ordersData, productsData] = await Promise.all([
        fetchAdminMetrics(),
        fetchAdminOrders(),
        fetchAdminProducts(),
      ]);
      setMetrics(metricsData);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load administrator data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setErrorMsg('');
      const updated = await updateAdminOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      setSuccessMsg(`Order ${updated.order_number} status updated to ${newStatus}.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update order status.');
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      slug: '',
      description: '',
      price: '',
      compare_at_price: '',
      sku: `ES-${Date.now().toString().slice(-6)}`,
      category_id: 1,
      primary_image: '',
      fabric: '',
      craft: '',
      is_active: true,
      is_featured: false,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      slug: prod.slug,
      description: prod.description || '',
      price: prod.price,
      compare_at_price: prod.compare_at_price || '',
      sku: prod.sku,
      category_id: prod.category_id,
      primary_image: prod.primary_image || '',
      fabric: prod.fabric || '',
      craft: prod.craft || '',
      is_active: prod.is_active,
      is_featured: prod.is_featured,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      setSubmittingProduct(true);
      setErrorMsg('');

      const payload = {
        name: productForm.name.trim(),
        slug: productForm.slug.trim().toLowerCase() || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: productForm.description.trim() || undefined,
        price: parseFloat(productForm.price),
        compare_at_price: productForm.compare_at_price ? parseFloat(productForm.compare_at_price) : undefined,
        sku: productForm.sku.trim(),
        category_id: parseInt(productForm.category_id, 10),
        primary_image: productForm.primary_image.trim() || undefined,
        fabric: productForm.fabric.trim() || undefined,
        craft: productForm.craft.trim() || undefined,
        is_active: Boolean(productForm.is_active),
        is_featured: Boolean(productForm.is_featured),
      };

      if (editingProduct) {
        await updateAdminProduct(editingProduct.id, payload);
        setSuccessMsg(`Product '${payload.name}' updated successfully.`);
      } else {
        await createAdminProduct(payload);
        setSuccessMsg(`Product '${payload.name}' created in catalog.`);
      }

      setIsProductModalOpen(false);
      await loadData();
      if (refreshProducts) {
        await refreshProducts();
      }
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save product.');
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (prodId, prodName) => {
    if (!window.confirm(`Are you sure you want to deactivate '${prodName}'?`)) return;
    try {
      await deleteAdminProduct(prodId);
      setSuccessMsg(`Product '${prodName}' deactivated.`);
      await loadData();
      if (refreshProducts) {
        await refreshProducts();
      }
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to deactivate product.');
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="admin-layout">
      {/* Top Administration Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          <div className="admin-topbar-logo">ES</div>
          <div>
            <span style={{ fontWeight: 700, letterSpacing: '0.05em' }}>ES ETHNIC STYLES</span>
            <span style={{ margin: '0 0.5rem', opacity: 0.6 }}>|</span>
            <span className="admin-badge-gold">Atelier Director Console</span>
          </div>
        </div>

        <div className="admin-topbar-actions">
          <Link to="/" className="admin-topbar-link" target="_blank" rel="noreferrer">
            <span>View Storefront</span>
            <ExternalLink size={14} />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="admin-topbar-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <div className="admin-content-wrapper">
        <div className="admin-header">
          <div>
            <h1>Executive Management</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Connected as <strong>{user?.full_name}</strong> ({user?.email}) • SQLite Live Engine
            </p>
          </div>
          {activeTab === 'products' && (
            <button
              type="button"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              onClick={handleOpenAddProduct}
            >
              <Plus size={18} />
              <span>Add Couture Product</span>
            </button>
          )}
        </div>

        {/* Global Feedback Alerts */}
        {errorMsg && <div className="auth-error-alert">{errorMsg}</div>}
        {successMsg && <div className="auth-success-alert">{successMsg}</div>}

        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('overview');
              navigate('/admin');
            }}
          >
            <Layers size={18} />
            <span>Dashboard Overview</span>
          </button>
          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('products');
              navigate('/admin/products');
            }}
          >
            <Package size={18} />
            <span>Product Catalog ({products.length})</span>
          </button>
          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('orders');
              navigate('/admin/orders');
            }}
          >
            <ShoppingBag size={18} />
            <span>Customer Orders ({orders.length})</span>
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto', color: 'var(--color-burgundy)' }} />
            <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Retrieving live database records...</p>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-icon-box">
                      <Package size={26} />
                    </div>
                    <div className="metric-info">
                      <span className="metric-label">Total Products</span>
                      <span className="metric-value">{metrics?.total_products || 0}</span>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon-box">
                      <ShoppingBag size={26} />
                    </div>
                    <div className="metric-info">
                      <span className="metric-label">Total Orders</span>
                      <span className="metric-value">{metrics?.total_orders || 0}</span>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon-box">
                      <DollarSign size={26} />
                    </div>
                    <div className="metric-info">
                      <span className="metric-label">Gross Revenue</span>
                      <span className="metric-value">{formatPrice(metrics?.total_revenue || 0)}</span>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon-box">
                      <Users size={26} />
                    </div>
                    <div className="metric-info">
                      <span className="metric-label">Registered Patrons</span>
                      <span className="metric-value">{metrics?.total_customers || 0}</span>
                    </div>
                  </div>
                </div>

                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-burgundy)', marginBottom: '1rem' }}>
                  Recent Customer Orders
                </h2>
                {metrics?.recent_orders?.length === 0 ? (
                  <div className="empty-orders-state">
                    <ShoppingBag className="empty-orders-icon" />
                    <p>No customer orders registered yet.</p>
                  </div>
                ) : (
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics?.recent_orders?.map((ord) => (
                          <tr key={ord.id}>
                            <td style={{ fontWeight: 700, color: 'var(--color-burgundy)' }}>{ord.order_number}</td>
                            <td>
                              <div>{ord.customer_name || 'Boutique Patron'}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{ord.customer_email}</div>
                            </td>
                            <td>{new Date(ord.created_at).toLocaleDateString('en-IN')}</td>
                            <td>{ord.items?.length || 0} items</td>
                            <td style={{ fontWeight: 700 }}>{formatPrice(ord.total_amount)}</td>
                            <td>
                              <select
                                className="btn-status-select"
                                value={ord.status}
                                onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="PROCESSING">PROCESSING</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="admin-action-btn"
                                style={{ backgroundColor: 'var(--color-blush-pink-light)', color: 'var(--color-burgundy)' }}
                                onClick={() => setSelectedOrder(ord)}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* PRODUCT CATALOG TAB */}
            {activeTab === 'products' && (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product Name</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.id}>
                        <td>
                          <img
                            src={prod.primary_image || '/images/products/placeholder.jpg'}
                            alt={prod.name}
                            style={{ width: '44px', height: '56px', objectFit: 'cover', borderRadius: '4px' }}
                            onError={(e) => {
                              e.target.src = '/images/logo.png';
                            }}
                          />
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{prod.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{prod.fabric || 'Artisanal Handloom'}</div>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{prod.sku}</td>
                        <td>{prod.category?.name || 'Couture'}</td>
                        <td style={{ fontWeight: 700 }}>{formatPrice(prod.price)}</td>
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: prod.is_active ? '#f0fdf4' : '#fef2f2',
                              color: prod.is_active ? '#15803d' : '#b91c1c',
                            }}
                          >
                            {prod.is_active ? 'Active' : 'Archived'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              type="button"
                              className="admin-action-btn"
                              style={{ backgroundColor: '#f1f5f9', color: '#0f172a' }}
                              onClick={() => handleOpenEditProduct(prod)}
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </button>
                            {prod.is_active && (
                              <button
                                type="button"
                                className="admin-action-btn"
                                style={{ backgroundColor: '#fef2f2', color: '#b91c1c' }}
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              >
                                <Trash2 size={14} />
                                <span>Deactivate</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ORDER MANAGEMENT TAB */}
            {activeTab === 'orders' && (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer Details</th>
                      <th>Placed Date</th>
                      <th>Total Items</th>
                      <th>Total Amount</th>
                      <th>Status Selector</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.id}>
                        <td style={{ fontWeight: 700, color: 'var(--color-burgundy)' }}>{ord.order_number}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{ord.customer_name || 'Boutique Patron'}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{ord.customer_email}</div>
                          {ord.contact_phone && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{ord.contact_phone}</div>
                          )}
                        </td>
                        <td>{new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td>{ord.items?.length || 0} line items</td>
                        <td style={{ fontWeight: 700, color: 'var(--color-burgundy)' }}>{formatPrice(ord.total_amount)}</td>
                        <td>
                          <select
                            className="btn-status-select"
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="admin-action-btn"
                            style={{ backgroundColor: 'var(--color-blush-pink-light)', color: 'var(--color-burgundy)' }}
                            onClick={() => setSelectedOrder(ord)}
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsProductModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editingProduct ? 'Edit Couture Silhouette' : 'New Couture Creation'}
              </h2>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="auth-form">
              <div className="auth-field-group">
                <label className="auth-label">Product Name *</label>
                <input
                  type="text"
                  className="auth-input"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Royal Gold Banarasi Silk Saree"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="auth-field-group">
                  <label className="auth-label">Price (INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="auth-input"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="25000"
                    required
                  />
                </div>
                <div className="auth-field-group">
                  <label className="auth-label">Compare-At Price (INR)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="auth-input"
                    value={productForm.compare_at_price}
                    onChange={(e) => setProductForm({ ...productForm, compare_at_price: e.target.value })}
                    placeholder="32000"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="auth-field-group">
                  <label className="auth-label">SKU Identifier *</label>
                  <input
                    type="text"
                    className="auth-input"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    required
                  />
                </div>
                <div className="auth-field-group">
                  <label className="auth-label">Category</label>
                  <select
                    className="auth-input"
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                  >
                    <option value={1}>Sarees</option>
                    <option value={2}>Kurtis</option>
                    <option value={3}>Lehengas</option>
                    <option value={4}>Salwar Suits</option>
                    <option value={5}>Festive Wear</option>
                    <option value={6}>New Arrivals</option>
                  </select>
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-label">Primary Image URL</label>
                <input
                  type="text"
                  className="auth-input"
                  value={productForm.primary_image}
                  onChange={(e) => setProductForm({ ...productForm, primary_image: e.target.value })}
                  placeholder="/images/products/saree-banarasi.jpg"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="auth-field-group">
                  <label className="auth-label">Fabric</label>
                  <input
                    type="text"
                    className="auth-input"
                    value={productForm.fabric}
                    onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                    placeholder="Pure Katan Silk"
                  />
                </div>
                <div className="auth-field-group">
                  <label className="auth-label">Craft</label>
                  <input
                    type="text"
                    className="auth-input"
                    value={productForm.craft}
                    onChange={(e) => setProductForm({ ...productForm, craft: e.target.value })}
                    placeholder="Zari Handloom"
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-label">Description</label>
                <textarea
                  className="auth-input"
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Mastercrafted silhouette with antique brocade borders..."
                />
              </div>

              <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={productForm.is_active}
                    onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
                  />
                  <span>Active &amp; Visible in Storefront</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={productForm.is_featured}
                    onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                  />
                  <span>Featured Collection Piece</span>
                </label>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={submittingProduct}
                style={{ marginTop: '1.5rem' }}
              >
                {submittingProduct ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Saving to SQLite...</span>
                  </>
                ) : (
                  <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Inspection Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Order {selectedOrder.order_number}</h2>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
              <div><strong>Patron:</strong> {selectedOrder.customer_name} ({selectedOrder.customer_email})</div>
              <div><strong>Contact:</strong> {selectedOrder.contact_phone || 'None provided'}</div>
              <div><strong>Status:</strong> {selectedOrder.status}</div>
              <div><strong>Payment:</strong> {selectedOrder.payment_method}</div>
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
                <strong>Shipping Address:</strong><br />
                {selectedOrder.shipping_address?.street || selectedOrder.shipping_address?.address}, {' '}
                {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} {selectedOrder.shipping_address?.postalCode || selectedOrder.shipping_address?.pincode}
              </div>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-burgundy)', marginBottom: '0.75rem' }}>
              Line Items ({selectedOrder.items?.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {selectedOrder.items?.map((it) => (
                <div
                  key={it.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <img
                    src={it.product_image || '/images/products/placeholder.jpg'}
                    alt={it.product_name}
                    style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                    onError={(e) => {
                      e.target.src = '/images/logo.png';
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{it.product_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Size: {it.size || 'Free Size'} • Qty: {it.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>{formatPrice(it.total_price)}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-burgundy)' }}>
              <span>Total Paid:</span>
              <span>{formatPrice(selectedOrder.total_amount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
