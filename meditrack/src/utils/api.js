// API service for making authenticated requests
const API_BASE_URL = 'http://localhost:5002/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No authentication token found');
    return { 'Content-Type': 'application/json' };
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Response handler
const handleResponse = async (response) => {
  // Handle empty responses (like 204 No Content)
  const contentType = response.headers.get('content-type');
  const data = contentType?.includes('application/json') 
    ? await response.json() 
    : await response.text();

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  // Generic request method
  request: async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      ...getAuthHeaders(),
      ...(options.headers || {})
    };

    console.log(`API Request: ${options.method || 'GET'} ${url}`, { headers });
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Include cookies if using sessions
      });

      const data = await handleResponse(response);
      console.log(`API Response (${response.status}):`, data);
      return data;
    } catch (error) {
      console.error('API Request Error:', {
        endpoint,
        error: error.message,
        status: error.status,
        data: error.data
      });

      // Handle specific error cases
      if (error.status === 401) {
        // Clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
      }

      throw error;
    }
  },

  // GET request
  get: (endpoint, options = {}) => 
    api.request(endpoint, { 
      ...options, 
      method: 'GET' 
    }),
  
  // POST request
  post: (endpoint, body, options = {}) => 
    api.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),
    
  // PUT request
  put: (endpoint, body, options = {}) =>
    api.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),
    
  // DELETE request
  delete: (endpoint, options = {}) => 
    api.request(endpoint, { 
      ...options,
      method: 'DELETE' 
    }),
    
  // Upload file
  upload: (endpoint, formData, options = {}) => {
    const headers = {
      ...getAuthHeaders(),
      // Remove Content-Type to let the browser set it with the correct boundary
      ...(options.headers || {})
    };
    delete headers['Content-Type'];
    
    return api.request(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers
    });
  }
};

export default api;
