const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const cleanBaseUrl = rawBaseUrl
  .trim()
  .replace(/\/+$/, '')
  .replace(/\/api\/v1\/products$/i, '')
  .replace(/\/auth$/i, '');

const API_BASE_URL = `${cleanBaseUrl}/api/v1/products`;

const getAuthHeaders = (extraHeaders = {}) => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders
  };
};

const handleNetworkError = (error) => {
  if (error.name === 'TypeError' || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
    return new Error(`Unable to connect to backend server. If deployed, ensure VITE_API_BASE_URL environment variable is set to your live backend URL.`);
  }
  return error;
};

export const getProducts = async ({ page = 1, limit = 20, search = '', expiryFilter = 'all' } = {}) => {
  try {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search && search.trim()) params.append('search', search.trim());
    if (expiryFilter) params.append('expiryFilter', expiryFilter);

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch products');
    }
    return data;
  } catch (error) {
    throw handleNetworkError(error);
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch product details');
    }
    return data;
  } catch (error) {
    throw handleNetworkError(error);
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    const data = await response.json();
    if (!response.ok) {
      const errorMessage = data.message || (data.errors && data.errors.map(e => e.msg).join(', ')) || 'Failed to create product';
      throw new Error(errorMessage);
    }
    return data;
  } catch (error) {
    throw handleNetworkError(error);
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'PUT',
      credentials: 'include',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    const data = await response.json();
    if (!response.ok) {
      const errorMessage = data.message || (data.errors && data.errors.map(e => e.msg).join(', ')) || 'Failed to update product';
      throw new Error(errorMessage);
    }
    return data;
  } catch (error) {
    throw handleNetworkError(error);
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete product');
    }
    return data;
  } catch (error) {
    throw handleNetworkError(error);
  }
};

export const lookupUpc = async (upcCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lookup/${upcCode}`, {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'UPC lookup failed');
    }
    return data;
  } catch (error) {
    throw handleNetworkError(error);
  }
};
