import { Routes, Route, Navigate, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
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
import StaffRoutes from './pages/dashboard/staff/StaffRoutes';
import DoctorRoutes from './pages/dashboard/doctor/DoctorRoutes';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<h1 className="text-3xl text-red-300 bg-slate-600 p-4">Welcome to Meditrack Clinic</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes */}
            <Route path="/dashboard/patient" element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientDashboard />
              </ProtectedRoute>
            } />

            <Route path="/dashboard/doctor" element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            } />

            <Route path="/dashboard/doctor/*" element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorRoutes />
              </ProtectedRoute>
            } />  

            <Route path="/dashboard/nurse" element={
              <ProtectedRoute allowedRoles={["nurse"]}>
                <NurseDashboard />
              </ProtectedRoute>
            } />

            <Route path="/dashboard/staff/*" element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <StaffRoutes />
              </ProtectedRoute>
            } />

            <Route path="/dashboard/owner" element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            } />

            <Route path="/dashboard/admin/*" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={["admin", "owner", "staff", "doctor", "nurse", "patient"]}>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Fallback routes */}
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;