import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/admin/Dashboard';
import Customers from './pages/admin/Customers';
import Inventory from './pages/admin/Inventory';
import Employees from './pages/admin/Employees';
import Orders from './pages/admin/Orders';
import Invoices from './pages/admin/Invoices';
import MyTasks from './pages/employee/MyTasks';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']}><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/invoices" element={<Invoices />} />
        </Route>

        {/* Employee Routes */}
        <Route element={<ProtectedRoute allowedRoles={['employee']}><Layout /></ProtectedRoute>}>
          <Route path="/my-tasks" element={<MyTasks />} />
        </Route>

        {/* Default route redirect based on role or login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
