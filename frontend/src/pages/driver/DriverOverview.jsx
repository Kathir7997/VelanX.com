import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Navigation, CheckCircle, Clock, Package, Wifi, WifiOff, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: Activity },
  { value: 'busy', label: 'Busy', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: Clock },
  { value: 'offline', label: 'Offline', color: 'text-gray-400', bg: 'bg-white/5 border-white/15', icon: WifiOff },
];

export default function DriverOverview() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: driverData } = useQuery({
    queryKey: ['driver-profile'],
    queryFn: async () => {
      const res = await api.get('/drivers/profile');
      return res.data.data;
    },
  });

  const { data: assignmentsData } = useQuery({
    queryKey: ['driver-assignments'],
    queryFn: async () => {
      const res = await api.get('/drivers/assignments');
      return res.data.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status) => api.put('/drivers/status', { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['driver-profile']);
      toast.success('Status updated!');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const driver = driverData;
  const assignments = assignmentsData || [];
  const activeAssignments = assignments.filter((s) => !['delivery_confirmed', 'cancelled'].includes(s.status));

  const stats = [
    { label: 'Completed', value: driver?.completedDeliveries || 0, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Active Jobs', value: activeAssignments.length, icon: Navigation, color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
    { label: 'Rating', value: driver?.rating ? `${driver.rating.toFixed(1)}⭐` : 'N/A', icon: Activity, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Driver Dashboard</h1>
        <p className="page-subtitle">Welcome, {user?.name}</p>
      </div>

      {/* Status Control */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">Your Status</h2>
        <div className="flex flex-wrap gap-3">
          {STATUS_OPTIONS.map(({ value, label, color, bg, icon: Icon }) => (
            <button
              key={value}
              id={`status-${value}`}
              onClick={() => statusMutation.mutate(value)}
              disabled={statusMutation.isLoading}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border font-semibold transition-all duration-200 ${
                driver?.status === value
                  ? `${bg} ${color} scale-105`
                  : 'bg-white/5 border-white/15 text-gray-400 hover:border-white/30'
              }`}
            >
              <Icon size={16} />
              {label}
              {driver?.status === value && <span className="w-2 h-2 rounded-full bg-current animate-pulse" />}
            </button>
          ))}
        </div>
        {driver?.status && (
          <p className="text-gray-500 text-sm mt-3">Current status: <span className="text-white font-medium capitalize">{driver.status}</span></p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="stat-card"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{value}</p>
              <p className="text-gray-400 text-sm">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Current Assignments */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-white font-semibold">Active Assignments</h2>
        </div>
        {activeAssignments.length === 0 ? (
          <div className="p-12 text-center">
            <Navigation size={40} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No active assignments</p>
            <p className="text-gray-600 text-sm mt-1">Set your status to Active to receive assignments</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {activeAssignments.map((s) => (
              <div key={s._id} className="bg-dark-800/60 rounded-xl p-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-primary-400 text-xs mb-1">{s.trackingNumber}</p>
                  <p className="text-white font-medium">{s.materialName}</p>
                  <p className="text-gray-400 text-sm">{s.pickupAddress?.city} → {s.deliveryAddress?.city}</p>
                </div>
                <span className="badge-warning">{s.status.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
