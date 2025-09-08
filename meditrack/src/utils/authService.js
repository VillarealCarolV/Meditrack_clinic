import api from './api';

const authService = {
  // Login function
  login: async (username, password) => {
    try {
      console.log('Attempting login with:', { username });
      
      // Clear any existing user data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Make login request
      const response = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      const responseData = await response.json();
      console.log('Login response:', { status: response.status, data: responseData });

      if (!response.ok) {
        throw new Error(responseData.message || 'Login failed');
      }

      if (responseData.success && responseData.user && responseData.token) {
        // Store user data and token
        localStorage.setItem('user', JSON.stringify(responseData.user));
        localStorage.setItem('token', responseData.token);
        console.log('Login successful, user stored:', responseData.user);
        return { 
          success: true, 
          user: responseData.user,
          token: responseData.token
        };
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Return the actual error message from the server if available
      const errorMessage = error.message || 'Invalid username or password';
      console.error('Login failed:', errorMessage);
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  },

  // Logout function - clears all authentication data
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('accounts');
    localStorage.removeItem('accounts_initialized');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },

  // Check if user has specific role
  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user && user.role === role;
  }
};

export default authService;
