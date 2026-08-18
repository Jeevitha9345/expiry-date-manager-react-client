const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '')

const handleNetworkError = (error) => {
  if (error.name === 'TypeError' || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
    return new Error(`Unable to connect to backend server at ${API_BASE_URL}. If deployed, ensure VITE_API_BASE_URL environment variable is set to your live backend URL.`)
  }
  return error
}

export const loginUser = async ({ email, password }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      const errorMessage = data.message || (data.errors && data.errors.map(e => e.msg).join(', ')) || 'Login failed'
      throw new Error(errorMessage)
    }

    return data
  } catch (error) {
    throw handleNetworkError(error)
  }
}

export const registerUser = async ({ name, email, password }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      const errorMessage = data.message || (data.errors && data.errors.map(e => e.msg).join(', ')) || 'Registration failed'
      throw new Error(errorMessage)
    }

    return data
  } catch (error) {
    throw handleNetworkError(error)
  }
}

export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Logout failed')
    }

    return data
  } catch (error) {
    throw handleNetworkError(error)
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.user
  } catch (error) {
    return null
  }
}

