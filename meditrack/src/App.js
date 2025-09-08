import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './Navbar';
import ProtectedRoute from './routes/ProtectedRoute';
import Unauthorized from './Unauthorized';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PatientDashboard from './pages/dashboard/patient/PatientDashboard';
import DoctorDashboard from './pages/dashboard/doctor/DoctorDashboard';
import NurseDashboard from './pages/dashboard/nurse/NurseDashboard';
import OwnerDashboard from './pages/dashboard/owner/OwnerDashboard';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';

import ReceptionistRoutes from './pages/dashboard/receptionist/ReceptionistRoutes';
import DoctorRoutes from './pages/dashboard/doctor/DoctorRoutes';
import PatientFormTest from './pages/test/PatientFormTest';
import './App.css';

// Component to check authentication and redirect accordingly
const RoleBasedHelpBotWrapper = () => {
  const auth = useAuth();
  const location = useLocation();

  if (location.pathname === '/login' || 
      location.pathname === '/register' || 
      location.pathname === '/unauthorized') {
    return null;
  }

  if (!auth?.user) {
    return null;
  }

  return null; 
};

const AuthCheck = ({ children }) => {
  const auth = useAuth();
  const user = auth?.user;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to appropriate dashboard based on user role
  switch(user.role) {
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    case 'doctor':
      return <Navigate to="/dashboard/doctor" replace />;
    case 'nurse':
      return <Navigate to="/dashboard/nurse" replace />;
    case 'staff':
    case 'receptionist':
      return <Navigate to="/dashboard/receptionist" replace />;
    // Owner role is merged into admin
    case 'owner':
      return <Navigate to="/dashboard/admin" replace />;
    case 'patient':
      return <Navigate to="/dashboard/patient" replace />;
    default:
      console.warn('Unknown user role:', user.role);
      return <Navigate to="/login" replace />;
  }
};

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/test/patient-form" element={<PatientFormTest />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['nurse']} />}>
          <Route path="/dashboard/nurse" element={<NurseDashboard />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
          <Route path="/dashboard/doctor/*" element={<DoctorRoutes />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['staff', 'receptionist']} />}>
          <Route path="/dashboard/receptionist/*" element={<ReceptionistRoutes />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
          <Route path="/dashboard/patient" element={<PatientDashboard />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
          <Route path="/dashboard/owner" element={<OwnerDashboard />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['admin', 'nurse', 'doctor', 'receptionist', 'patient', 'owner']} />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <RoleBasedHelpBotWrapper />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
