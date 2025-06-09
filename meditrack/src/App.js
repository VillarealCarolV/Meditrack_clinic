import { Routes, Route, Navigate, unstable_HistoryRouter as Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
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
import ReportsPage from './pages/dashboard/staff/pages/ReportsPage';
import UserManagementPage from './pages/dashboard/staff/pages/UserManagementPage';
import AppointmentsPage from './pages/dashboard/staff/pages/AppointmentsPage';
import AppointmentManagementPanel from './pages/dashboard/staff/AppointmentManagementPanel';
import SettingsPage from './pages/dashboard/staff/pages/SettingsPage';
import Appointments from './pages/dashboard/doctor/Appointments';
import './App.css';

const history = createBrowserHistory({
  future: {
    v7_relativeSplatPath: true,
  },
});

function App() {
  return (
    <AuthProvider>
      <Router history={history}>
        <Navbar />
        <div className="App">
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
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
          <Route path="/dashboard/doctor/appointments" element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <Appointments />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/nurse" element={
            <ProtectedRoute allowedRoles={["nurse"]}>
              <NurseDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/staff" element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <ReportsPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/staff/appointments" element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <AppointmentManagementPanel />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/user-management" element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <UserManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/settings" element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/owner" element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={["admin", "owner", "staff", "doctor", "nurse", "patient"]}>
              <Profile />
            </ProtectedRoute>
          } />
          {/* Fallback: redirect to login if no match */}
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<h1 className="text-3xl text-red-300 bg-slate-600">Welcome</h1>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
