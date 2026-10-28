const API_BASE = '/api/v1';

export function getAuthToken() {
  return localStorage.getItem('es_auth_token');
}

export function getAuthHeaders() {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Register a new patron customer account
 */
export async function registerCustomer(data) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const resData = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(resData.detail || 'Registration failed. Please check your information.');
  }
  return resData;
}

/**
 * Authenticate customer or administrator
 */
export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const resData = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(resData.detail || 'Invalid email or password.');
  }
  return resData;
}

/**
 * Fetch current authenticated user profile
 */
export async function fetchCurrentProfile() {
  const response = await fetch(`${API_BASE}/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Session expired or unauthorized.');
  }
  return response.json();
}

/**
 * Update current user profile
 */
export async function updateCurrentProfile(data) {
  const response = await fetch(`${API_BASE}/auth/me`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const resData = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(resData.detail || 'Profile update failed.');
  }
  return resData;
}

/**
 * Create a new customer order
 */
export async function createOrder(orderPayload) {
  const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderPayload),
  });

  const resData = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(resData.detail || 'Failed to place order.');
  }
  return resData;
}

/**
 * Fetch authenticated customer's orders
 */
export async function fetchMyOrders() {
  const response = await fetch(`${API_BASE}/orders/my-orders`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to retrieve order history.');
  }
  return response.json();
}

/**
 * Fetch real-time dashboard metrics (Admin only)
 */
export async function fetchAdminMetrics() {
  const response = await fetch(`${API_BASE}/admin/metrics`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Access denied: Admin privileges required.');
  }
  return response.json();
}

/**
 * Fetch all customer orders (Admin only)
 */
export async function fetchAdminOrders() {
  const response = await fetch(`${API_BASE}/admin/orders`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch admin orders.');
  }
  return response.json();
}

/**
 * Update an order status (Admin only)
 */
export async function updateAdminOrderStatus(orderId, status) {
  const response = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update order status.');
  }
  return response.json();
}

/**
 * Fetch all products for admin catalog management (Admin only)
 */
export async function fetchAdminProducts() {
  const response = await fetch(`${API_BASE}/admin/products`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch admin products.');
  }
  return response.json();
}

/**
 * Add a new product to SQLite database (Admin only)
 */
export async function createAdminProduct(productData) {
  const response = await fetch(`${API_BASE}/admin/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });

  const resData = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(resData.detail || 'Failed to create product.');
  }
  return resData;
}

/**
 * Update existing product (Admin only)
 */
export async function updateAdminProduct(productId, productData) {
  const response = await fetch(`${API_BASE}/admin/products/${productId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });

  const resData = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(resData.detail || 'Failed to update product.');
  }
  return resData;
}

/**
 * Deactivate or delete product (Admin only)
 */
export async function deleteAdminProduct(productId) {
  const response = await fetch(`${API_BASE}/admin/products/${productId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to delete product.');
  }
  return response.json();
}
