const API_BASE = '/api';

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  const data = await res.json();
  return data;
}

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams(params);
  const res = await fetch(`${API_BASE}/products?${query.toString()}`);
  const data = await res.json();
  return data.products || [];
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  const data = await res.json();
  return data.product;
}

export async function createProduct(payload) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function updateProduct(id, payload) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  const data = await res.json();
  return data.categories || [];
}

export async function createCategory(payload) {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function fetchEnquiries(params = {}) {
  const query = new URLSearchParams(params);
  const res = await fetch(`${API_BASE}/enquiries?${query.toString()}`);
  const data = await res.json();
  return data.enquiries || [];
}

export async function updateEnquiryStatus(id, status) {
  const res = await fetch(`${API_BASE}/enquiries/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return await res.json();
}

export async function fetchSettings() {
  const res = await fetch(`${API_BASE}/settings`);
  const data = await res.json();
  return data.settings || {};
}

export async function updateSettings(payload) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function uploadImageToR2(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', file.name);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Image upload to Cloudflare R2 failed');
  }

  return data.url;
}

// Backward-compatibility alias
export const uploadImageToImageKit = uploadImageToR2;
