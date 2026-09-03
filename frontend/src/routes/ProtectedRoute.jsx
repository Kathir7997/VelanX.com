import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Role to dashboard mapping
export const ROLE_DASHBOARDS = {
  customer: '/dashboard/customer',
  driver: '/dashboard/driver',
  warehouse_manager: '/dashboard/warehouse',
  accountant: '/dashboard/accountant',
  general_manager: '/dashboard/manager',
  admin: '/dashboard/admin',
  owner: '/dashboard/owner',
};

// Protected route wrapper
export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const dashboard = ROLE_DASHBOARDS[user?.role] || '/login';
    return <Navigate to={dashboard} replace />;
  }

  return children;
}

// Public only route (redirect if logged in)
export function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    const dashboard = ROLE_DASHBOARDS[user.role] || '/';
    return <Navigate to={dashboard} replace />;
  }

  return children;
}
