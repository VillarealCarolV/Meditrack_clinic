import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // Redirect if already logged in
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      // Map roles to dashboards
      const roleToDashboard = {
        admin: '/dashboard/staff',
        staff: '/dashboard/staff',
        owner: '/dashboard/owner',
        doctor: '/dashboard/doctor',
        nurse: '/dashboard/nurse',
        patient: '/dashboard/patient',
      };
      const dashboard = roleToDashboard[user.role];
      if (dashboard) {
        navigate(dashboard);
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Submitting login form');
    console.log('Email:', email, 'Password:', password);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed. Please check your credentials.');
      }
      
      const data = await response.json();
      console.log('Login successful. Response:', data);
      
      // Save JWT and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('User data saved to localStorage');
      // Redirect to dashboard for user role
      // Map roles to dashboards
      const roleToDashboard = {
        admin: '/dashboard/staff',
        staff: '/dashboard/staff',
        owner: '/dashboard/owner',
        doctor: '/dashboard/doctor',
        nurse: '/dashboard/nurse',
        patient: '/dashboard/patient',
      };
      const dashboard = roleToDashboard[data.user.role];
      console.log('Redirecting to:', dashboard, 'User:', data.user);
      if (dashboard) {
        navigate(dashboard, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to log in. Please check your network connection and try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-8 rounded shadow w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <div>
        <div className="mb-1 text-left">
          <label className="block mb-1 font-medium">Email</label></div>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
          />
        </div>
        <div>
        <div className="mb-1 text-left">
          <label className="block mb-1 font-medium">Password</label></div>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a 
              href="/register" 
              className="text-blue-600 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate('/register');
              }}
            >
              Register here
            </a>
          </p>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}
