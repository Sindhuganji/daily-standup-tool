import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import Dashboard from './components/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import Login from './components/Login';
import ManagerDashboard from './components/ManagerDashboard';
import MyTeams from './components/MyTeams';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './components/Register';
import Updates from './components/Updates';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER DASHBOARD */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="teams" element={<MyTeams />} />
          <Route path="updates" element={<Updates />} />
        </Route>

        {/* MANAGER DASHBOARD */}
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ FIXED DEFAULT REDIRECT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}