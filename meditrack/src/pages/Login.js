import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  // Hooks at the top level
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();
  const auth = useAuth();
  const { user, loading } = auth || {};
  
  // Handle loading state and auth initialization
  useEffect(() => {
    if (!loading) {
      setIsInitializing(false);
    }
  }, [loading]);
  
  // Redirect after successful login
  const prevUserRef = React.useRef();
  useEffect(() => {
    console.log('useEffect - user state changed:', { 
      hasUser: !!user, 
      userRole: user?.role,
      prevUserRole: prevUserRef.current?.role 
    });

    // Proceed if we have a user with a role
    if (user?.role) {
      console.log('Preparing to redirect user with role:', user.role);
      
      const rolePath = {
        admin: '/dashboard/admin',
        nurse: '/dashboard/nurse',
        receptionist: '/dashboard/receptionist',
        doctor: '/dashboard/doctor',
        patient: '/dashboard/patient',
        staff: '/dashboard/receptionist', // Both staff and receptionist use the same dashboard
        owner: '/dashboard/admin'
      };
      
      const targetPath = rolePath[user.role] || '/dashboard';
      console.log('Navigating to:', targetPath);
      
      // Use setTimeout to ensure navigation happens in the next tick
      const timer = setTimeout(() => {
        console.log('Executing navigation to:', targetPath);
        navigate(targetPath, { replace: true });
      }, 0);
      
      return () => {
        console.log('Cleaning up navigation timeout');
        clearTimeout(timer);
      };
    } else {
      console.log('No user role available for navigation');
    }
    
    // Update the ref after processing
    prevUserRef.current = user;
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted');
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Calling auth.login with:', { email });
      const result = await auth.login(email, password);
      console.log('Login result in handleSubmit:', result);
      
      // The actual navigation is now handled by the useEffect above
      // which watches for user.role changes
      if (!result || !result.success) {
        throw new Error('Login failed: No success flag in response');
      }
      
      console.log('Login successful, user should be redirected soon');
    } catch (error) {
      console.error('Login error in handleSubmit:', {
        message: error.message,
        stack: error.stack,
        email
      });
      setError(error.message || 'Failed to log in. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while auth is initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-800">MediTrack Login</h1>
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email or Username</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email or username"
                  required
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Sign In
              </button>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}
            
            {/* Registration Link */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:underline font-medium"
              >
                Register here
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
