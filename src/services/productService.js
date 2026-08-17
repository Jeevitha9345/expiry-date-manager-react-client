const API_BASE_URL = 'http://localhost:5001/api/v1/products';

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
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch products');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch product details');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    const data = await response.json();
    if (!response.ok) {
      const errorMessage = data.message || (data.errors && data.errors.map(e => e.msg).join(', ')) || 'Failed to create product';
      throw new Error(errorMessage);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    const data = await response.json();
    if (!response.ok) {
      const errorMessage = data.message || (data.errors && data.errors.map(e => e.msg).join(', ')) || 'Failed to update product';
      throw new Error(errorMessage);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete product');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const lookupUpc = async (upcCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lookup/${upcCode}`, {
      method: 'GET',
      credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'UPC lookup failed');
    }
    return data;
  } catch (error) {
    throw error;
  }
};
