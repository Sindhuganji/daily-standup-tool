import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import Dashboard from './components/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import Login from './components/Login';
import MyTeams from './components/MyTeams';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './components/Register';
import Updates from './components/Updates';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}