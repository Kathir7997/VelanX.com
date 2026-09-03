import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, Truck, Warehouse, Users, TrendingUp, Activity } from 'lucide-react';
import api from '../../lib/axios';

export default function ManagerOverview() {
  const { data: summary } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => { const r = await api.get('/analytics/dashboard'); return r.data.data; },
  });

  const stats = [
    { label: 'Total Shipments', value: summary?.totalShipments || 0, icon: Package, color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
    { label: 'Active Shipments', value: summary?.activeShipments || 0, icon: Activity, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { label: 'Total Drivers', value: summary?.totalDrivers || 0, icon: Users, color: 'text-accent-400', bg: 'bg-accent-500/10 border-accent-500/20' },
    { label: 'Warehouses', value: summary?.totalVehicles || 0, icon: Warehouse, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Total Revenue', value: `₹${(summary?.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Vehicles Available', value: summary?.availableVehicles || 0, icon: Truck, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manager Dashboard</h1>
        <p className="page-subtitle">Operational overview and monitoring</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="stat-card">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${bg}`}><Icon size={18} className={color} /></div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{value}</p>
              <p className="text-gray-400 text-sm">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
