import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user } = useAuth();
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (user && user.role) {
      // Map roles to dashboards
      const roleToDashboard = {
        admin: '/dashboard/admin',
        staff: '/dashboard/staff',
        owner: '/dashboard/owner',
        doctor: '/dashboard/doctor',
        nurse: '/dashboard/nurse',
        patient: '/dashboard/patient',
      };
      const dashboard = roleToDashboard[user.role];
      if (dashboard) {
        navigate(dashboard, { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      // The AuthContext will handle the redirection in the useEffect above
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to log in. Please check your credentials and try again.');
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
            <label className="block mb-1 font-medium">Password</label>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full border px-3 py-2 pr-10 rounded"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
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
