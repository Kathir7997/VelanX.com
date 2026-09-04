import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './lib/queryClient';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import TrackingPage from './pages/public/TrackingPage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import PricingPage from './pages/public/PricingPage';
import ContactPage from './pages/public/ContactPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Customer Dashboard
import CustomerOverview from './pages/customer/CustomerOverview';
import CreateShipment from './pages/customer/CreateShipment';
import CustomerShipments from './pages/customer/CustomerShipments';
import CustomerTracking from './pages/customer/CustomerTracking';
import CustomerInvoices from './pages/customer/CustomerInvoices';

// Driver Dashboard
import DriverOverview from './pages/driver/DriverOverview';
import DriverAssignments from './pages/driver/DriverAssignments';
import DriverDeliveries from './pages/driver/DriverDeliveries';
import DriverPODHistory from './pages/driver/DriverPODHistory';

// Warehouse Dashboard
import WarehouseOverview from './pages/warehouse/WarehouseOverview';
import IncomingShipments from './pages/warehouse/IncomingShipments';
import OutgoingShipments from './pages/warehouse/OutgoingShipments';
import WarehouseReports from './pages/warehouse/WarehouseReports';
import WarehouseLoadBalancing from './pages/warehouse/WarehouseLoadBalancing';

// Accountant Dashboard
import AccountantOverview from './pages/accountant/AccountantOverview';
import PayrollPage from './pages/accountant/PayrollPage';
import ExpensesPage from './pages/accountant/ExpensesPage';
import RevenueReports from './pages/accountant/RevenueReports';

// Manager Dashboard
import ManagerOverview from './pages/manager/ManagerOverview';
import ManagerWarehouses from './pages/manager/ManagerWarehouses';
import ManagerShipments from './pages/manager/ManagerShipments';
import ManagerDrivers from './pages/manager/ManagerDrivers';
import ManagerReplacements from './pages/manager/ManagerReplacements';

// Admin Dashboard
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDrivers from './pages/admin/AdminDrivers';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminWarehouses from './pages/admin/AdminWarehouses';
import AdminAnalytics from './pages/admin/AdminAnalytics';

// Shared
import SharedSettings from './pages/shared/SharedSettings';

// Owner Dashboard
import OwnerOverview from './pages/owner/OwnerOverview';
import OwnerAnalytics from './pages/owner/OwnerAnalytics';
import OwnerAdmins from './pages/owner/OwnerAdmins';
import OwnerRiskAlerts from './pages/owner/OwnerRiskAlerts';
import OwnerCommandCenter from './pages/owner/OwnerCommandCenter';

// Loading Spinner
const LoadingSpinner = () => (
  <div className="min-h-screen bg-dark-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      <p className="text-gray-400 text-sm animate-pulse">Loading VelanX...</p>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a28',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/track" element={<TrackingPage />} />
              <Route path="/track/:trackingNumber" element={<TrackingPage />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
            <Route path="/reset-password/:token" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

            {/* Customer Dashboard */}
            <Route path="/dashboard/customer" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <DashboardLayout role="customer" />
              </ProtectedRoute>
            }>
              <Route index element={<CustomerOverview />} />
              <Route path="create-shipment" element={<CreateShipment />} />
              <Route path="shipments" element={<CustomerShipments />} />
              <Route path="track" element={<CustomerTracking />} />
              <Route path="invoices" element={<CustomerInvoices />} />
              <Route path="settings" element={<SharedSettings />} />
            </Route>

            {/* Driver Dashboard */}
            <Route path="/dashboard/driver" element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DashboardLayout role="driver" />
              </ProtectedRoute>
            }>
              <Route index element={<DriverOverview />} />
              <Route path="assignments" element={<DriverAssignments />} />
              <Route path="deliveries" element={<DriverDeliveries />} />
              <Route path="pods" element={<DriverPODHistory />} />
              <Route path="settings" element={<SharedSettings />} />
            </Route>

            {/* Warehouse Dashboard */}
            <Route path="/dashboard/warehouse" element={
              <ProtectedRoute allowedRoles={['warehouse_manager']}>
                <DashboardLayout role="warehouse_manager" />
              </ProtectedRoute>
            }>
              <Route index element={<WarehouseOverview />} />
              <Route path="incoming" element={<IncomingShipments />} />
              <Route path="outgoing" element={<OutgoingShipments />} />
              <Route path="load-balancing" element={<WarehouseLoadBalancing />} />
              <Route path="reports" element={<WarehouseReports />} />
              <Route path="settings" element={<SharedSettings />} />
            </Route>

            {/* Accountant Dashboard */}
            <Route path="/dashboard/accountant" element={
              <ProtectedRoute allowedRoles={['accountant']}>
                <DashboardLayout role="accountant" />
              </ProtectedRoute>
            }>
              <Route index element={<AccountantOverview />} />
              <Route path="payroll" element={<PayrollPage />} />
              <Route path="expenses" element={<ExpensesPage />} />
              <Route path="reports" element={<RevenueReports />} />
              <Route path="settings" element={<SharedSettings />} />
            </Route>

            {/* Manager Dashboard */}
            <Route path="/dashboard/manager" element={
              <ProtectedRoute allowedRoles={['general_manager']}>
                <DashboardLayout role="general_manager" />
              </ProtectedRoute>
            }>
              <Route index element={<ManagerOverview />} />
              <Route path="warehouses" element={<ManagerWarehouses />} />
              <Route path="shipments" element={<ManagerShipments />} />
              <Route path="drivers" element={<ManagerDrivers />} />
              <Route path="replacements" element={<ManagerReplacements />} />
              <Route path="settings" element={<SharedSettings />} />
            </Route>

            {/* Admin Dashboard */}
            <Route path="/dashboard/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout role="admin" />
              </ProtectedRoute>
            }>
              <Route index element={<AdminOverview />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="drivers" element={<AdminDrivers />} />
              <Route path="vehicles" element={<AdminVehicles />} />
              <Route path="warehouses" element={<AdminWarehouses />} />
              <Route path="settings" element={<SharedSettings />} />
            </Route>

            {/* Owner Dashboard */}
            <Route path="/dashboard/owner" element={
              <ProtectedRoute allowedRoles={['owner']}>
                <DashboardLayout role="owner" />
              </ProtectedRoute>
            }>
              <Route index element={<OwnerOverview />} />
              <Route path="analytics" element={<OwnerAnalytics />} />
              <Route path="admins" element={<OwnerAdmins />} />
              <Route path="vehicles" element={<AdminVehicles />} />
              <Route path="risks" element={<OwnerRiskAlerts />} />
              <Route path="command-center" element={<OwnerCommandCenter />} />
              <Route path="settings" element={<SharedSettings />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
