import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import {
  Truck, LayoutDashboard, Package, MapPin, FileText, User, LogOut,
  Bell, Settings, Users, Warehouse,
  BarChart3, DollarSign, ClipboardList, Navigation, TrendingUp,
  PackageCheck, PackageX, Wallet, ShieldAlert, ArrowRightLeft, FileCheck, RefreshCw
} from 'lucide-react';
import SpatialBackground from './SpatialBackground';
import FloatingBottomNav from './FloatingBottomNav';

const SIDEBAR_LINKS = {
  customer: [
    { label: 'Overview', href: '', icon: LayoutDashboard },
    { label: 'Create Shipment', href: 'create-shipment', icon: Package },
    { label: 'My Shipments', href: 'shipments', icon: ClipboardList },
    { label: 'Track Shipment', href: 'track', icon: MapPin },
    { label: 'Invoices', href: 'invoices', icon: FileText },
    { label: 'Settings', href: 'settings', icon: Settings },
  ],
  driver: [
    { label: 'Overview', href: '', icon: LayoutDashboard },
    { label: 'Assignments', href: 'assignments', icon: Navigation },
    { label: 'Deliveries', href: 'deliveries', icon: PackageCheck },
    { label: 'POD History', href: 'pods', icon: FileCheck },
    { label: 'Settings', href: 'settings', icon: Settings },
  ],
  warehouse_manager: [
    { label: 'Overview', href: '', icon: LayoutDashboard },
    { label: 'Incoming', href: 'incoming', icon: Package },
    { label: 'Outgoing', href: 'outgoing', icon: PackageX },
    { label: 'Load Balancing', href: 'load-balancing', icon: ArrowRightLeft },
    { label: 'Reports', href: 'reports', icon: BarChart3 },
    { label: 'Settings', href: 'settings', icon: Settings },
  ],
  accountant: [
    { label: 'Overview', href: '', icon: LayoutDashboard },
    { label: 'Payroll', href: 'payroll', icon: Wallet },
    { label: 'Expenses', href: 'expenses', icon: DollarSign },
    { label: 'Reports', href: 'reports', icon: TrendingUp },
    { label: 'Settings', href: 'settings', icon: Settings },
  ],
  general_manager: [
    { label: 'Overview', href: '', icon: LayoutDashboard },
    { label: 'Warehouses', href: 'warehouses', icon: Warehouse },
    { label: 'Shipments', href: 'shipments', icon: ClipboardList },
    { label: 'Drivers', href: 'drivers', icon: User },
    { label: 'Replacements', href: 'replacements', icon: RefreshCw },
    { label: 'Settings', href: 'settings', icon: Settings },
  ],
  admin: [
    { label: 'Overview', href: '', icon: LayoutDashboard },
    { label: 'Analytics', href: 'analytics', icon: TrendingUp },
    { label: 'Staff Management', href: 'users', icon: Users },
    { label: 'Drivers', href: 'drivers', icon: Truck },
    { label: 'Vehicles', href: 'vehicles', icon: Truck },
    { label: 'Warehouses', href: 'warehouses', icon: Warehouse },
    { label: 'Settings', href: 'settings', icon: Settings },
  ],
  owner: [
    { label: 'Command Center', href: 'command-center', icon: TrendingUp },
    { label: 'Overview', href: '', icon: LayoutDashboard },
    { label: 'Risk Alerts', href: 'risks', icon: ShieldAlert },
    { label: 'Analytics', href: 'analytics', icon: TrendingUp },
    { label: 'Admins', href: 'admins', icon: Users },
    { label: 'Vehicles', href: 'vehicles', icon: Truck },
    { label: 'Settings', href: 'settings', icon: Settings },
  ],
};

const ROLE_BASE_PATHS = {
  customer: '/dashboard/customer',
  driver: '/dashboard/driver',
  warehouse_manager: '/dashboard/warehouse',
  accountant: '/dashboard/accountant',
  general_manager: '/dashboard/manager',
  admin: '/dashboard/admin',
  owner: '/dashboard/owner',
};

export default function DashboardLayout({ role }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const links = SIDEBAR_LINKS[role] || [];
  const basePath = ROLE_BASE_PATHS[role];
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  useEffect(() => {
    const handleTriggerLogout = () => {
      handleLogout();
    };
    window.addEventListener('trigger-logout', handleTriggerLogout);
    return () => window.removeEventListener('trigger-logout', handleTriggerLogout);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <SpatialBackground role={role} />

      {/* Floating Top Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="vision-header flex-shrink-0 z-40 relative mt-4 mx-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Truck size={20} className="text-white" />
          </div>
          <span className="text-2xl font-display font-bold text-white tracking-wide">VelanX</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="w-12 h-12 rounded-full vision-glass flex items-center justify-center text-white hover:bg-white/10 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </button>

          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-12 h-12 rounded-full vision-glass flex items-center justify-center text-white font-bold overflow-hidden border border-white/20 hover:border-white/40 transition-all shadow-lg"
            >
              {user?.name?.charAt(0).toUpperCase()}
            </button>
            
            <AnimatePresence>
              {profileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-14 w-64 vision-panel p-4 z-50 flex flex-col gap-3"
                >
                  <div className="flex flex-col border-b border-white/10 pb-3">
                    <span className="text-white font-semibold text-lg">{user?.name}</span>
                    <span className="text-gray-400 text-xs">{user?.email}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-3 rounded-xl text-red-400 hover:bg-red-500/20 transition-colors font-medium"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* Main Glass Content Area */}
      <main className="flex-1 relative z-10 px-6 pb-32 max-w-[1600px] w-full mx-auto overflow-y-auto no-scrollbar">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Floating Bottom Spatial Nav */}
      <FloatingBottomNav links={links} basePath={basePath} />
    </div>
  );
}
