import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    username
    : '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [patientId, setPatientId] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const navigate = useNavigate();


  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else {
      const cleanedNumber = formData.phoneNumber.replace(/\D/g, ''); 
      const phoneRegex = /^9\d{9}$/; 
      
      if (cleanedNumber.length !== 10 || !phoneRegex.test(cleanedNumber)) {
        newErrors.phoneNumber = 'Please enter a valid 10-digit Philippine mobile number starting with 9 (e.g., 9123456789)';
      }
    }
    

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }
    

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the privacy policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // For demo, we'll simulate an API call
      const isUsernameAvailable = await checkUsernameAvailability(formData.username);
      
      if (!isUsernameAvailable) {
        setErrors(prev => ({
          ...prev,
          username: 'Username is already taken'
        }));
        setIsSubmitting(false);
        return;
      }
      
      // For demo, we'll simulate sending an SMS
      console.log('Sending verification code to', formData.phoneNumber);
      
      //verification step
      setShowVerification(true);
      setVerificationSent(true);
      setCountdown(60); 
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // username availability check
  const checkUsernameAvailability = async (username) => {

    return new Promise(resolve => {
      setTimeout(() => {

        resolve(username.toLowerCase() !== 'test');
      }, 500);
    });
  };
  
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    if (!verificationCode) {
      setErrors(prev => ({
        ...prev,
        verification: 'Please enter the verification code'
      }));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // For demo, we'll accept any 6-digit code
      if (!/^\d{6}$/.test(verificationCode)) {
        throw new Error('Invalid verification code format');
      }
      

      console.log('Verifying code:', verificationCode);
      
  
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // patient ID 
      const currentYear = new Date().getFullYear();
     
      const sequenceNumber = Math.floor(1000 + Math.random() * 9000);
      const mockPatientId = `PT${currentYear}${sequenceNumber}`;
      
     
      console.log('Registration successful', {
        ...formData,
        patientId: mockPatientId,
        status: 'pending_approval'
      });
      
      setPatientId(mockPatientId);
      setRegistrationStatus('pending_approval');
      
    } catch (error) {
      console.error('Verification error:', error);
      setErrors(prev => ({
        ...prev,
        verification: error.message || 'Invalid verification code. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResendCode = () => {
    if (countdown > 0) return;
    
    //resend the verification code
    console.log('Resending verification code to', formData.phoneNumber);
    setCountdown(60);
  };
  
  if (registrationStatus === 'pending_approval') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Awaiting Approval</h2>
            <p className="text-gray-600">
              Your registration is pending approval from the clinic administrator. 
              You will be notified via SMS once your account is approved.
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                Your Patient ID: <span className="font-semibold">{patientId}</span>
              </p>
              <p className="text-xs text-blue-700 mt-1">Please keep this ID for future reference.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }
  
  if (showVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-2">Verify Your Phone</h2>
          <p className="text-gray-600 text-center mb-6">
            We've sent a 6-digit verification code to <span className="font-semibold">{formData.phoneNumber}</span>
          </p>
          
          <form onSubmit={handleVerifyCode}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength="6"
                className={`w-full px-3 py-2 border rounded-md ${errors.verification ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => {
                  // Only numbers
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setVerificationCode(value);
                  if (errors.verification) {
                    setErrors(prev => ({
                      ...prev,
                      verification: null
                    }));
                  }
                }}
              />
              {errors.verification && (
                <p className="mt-1 text-sm text-red-600">{errors.verification}</p>
              )}
            </div>
            
            <div className="mb-6 text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={countdown > 0}
                className={`text-sm ${countdown > 0 ? 'text-gray-400' : 'text-blue-600 hover:underline'}`}
              >
                {countdown > 0 
                  ? `Resend code in ${countdown}s` 
                  : 'Didn\'t receive a code? Resend'}
              </button>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Verifying...' : 'Verify and Register'}
            </button>
            
            <button
              type="button"
              onClick={() => setShowVerification(false)}
              className="w-full mt-3 text-sm text-gray-600 hover:text-gray-800"
            >
              Back to registration
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Patient Account</h1>
        
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.submit}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <div className="mb-1 text-left">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
              </div>
              <input
                type="text"
                name="fullName"
                className={`w-full px-3 py-2 border rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Juan Dela Cruz"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>
            
            <div>
              <div className="mb-1 text-left">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">+63</span>
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  className={`w-full pl-12 px-3 py-2 border rounded-md ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="9123456789"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    
                    let value = e.target.value.replace(/\D/g, '');
                    
 
                    if (value.length > 10) {
                      value = value.slice(-10);
                    } else {
                      value = value.slice(0, 10);
                    }
                    
                    setFormData(prev => ({
                      ...prev,
                      phoneNumber: value
                    }));
                    
                    if (errors.phoneNumber) {
                      setErrors(prev => ({
                        ...prev,
                        phoneNumber: null
                      }));
                    }
                  }}
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Example: 9123456789 or +639123456789 (must start with 9)
              </p>
            </div>
            
            <div>
              <div className="mb-1 text-left">
                <label className="block text-sm font-medium text-gray-700">
                  Username <span className="text-red-500">*</span>
                </label>
              </div>
              <input
                type="text"
                name="username"
                className={`w-full px-3 py-2 border rounded-md ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>
            
            <div>
              <div className="mb-1 text-left">
                <label className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
              </div>
              <input
                type="password"
                name="password"
                className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters long
              </p>
            </div>
            
            <div>
              <div className="mb-1 text-left">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
              </div>
              <input
                type="password"
                name="confirmPassword"
                className={`w-full px-3 py-2 border rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                  I agree to the <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> and <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> <span className="text-red-500">*</span>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                )}
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
              >
                {isSubmitting ? 'Processing...' : 'Register'}
              </button>
            </div>
            
            <div className="text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:underline focus:outline-none"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}