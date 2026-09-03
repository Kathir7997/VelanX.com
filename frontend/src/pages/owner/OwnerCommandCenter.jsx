import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { ShieldAlert, TrendingUp, Package, Car, Users, AlertCircle } from 'lucide-react';
import api from '../../lib/axios';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function OwnerCommandCenter() {
  const { data, isLoading } = useQuery({
    queryKey: ['logistics-command-center'],
    queryFn: async () => {
      const res = await api.get('/logistics/command-center');
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="text-gray-400">Loading Command Center...</div>;
  }

  const {
    activeShipments,
    delayedShipments,
    revenue,
    driverStatus,
    vehicleStatus,
    criticalRisks,
    monthlyData,
    warehouseStats
  } = data || {};

  const formatCurrency = (val) => `₹${(val || 0).toLocaleString('en-IN')}`;

  const pieData = [
    { name: 'Active', value: activeShipments },
    { name: 'Delayed', value: delayedShipments },
  ];

  return (
    <div className="space-y-6">
      <div className="page-header mb-0">
        <h1 className="page-title flex items-center gap-2">
          <TrendingUp className="text-primary-500" />
          Logistics Command Center
        </h1>
        <p className="page-subtitle">Enterprise-level operations overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(revenue), icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
          { label: 'Critical Risks', value: criticalRisks, icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
          { label: 'Active Drivers', value: `${driverStatus?.active}/${driverStatus?.total}`, icon: Users, color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
          { label: 'Vehicles In Use', value: `${vehicleStatus?.inUse}/${vehicleStatus?.total}`, icon: Car, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
        ].map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div 
            key={label} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            className={`stat-card border ${bg}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">{label}</p>
                <p className="text-2xl font-display font-bold text-white mt-1">{value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-dark-900/50`}>
                <Icon size={20} className={color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <RechartsTooltip contentStyle={{ background: '#111120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Warehouse Capacity */}
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold mb-4">Warehouse Capacity Utilization (%)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={warehouseStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} domain={[0, 100]} />
              <RechartsTooltip contentStyle={{ background: '#111120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Bar dataKey="utilization" fill="#06b6d4" radius={[4, 4, 0, 0]}>
                {warehouseStats?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.utilization > 90 ? '#ef4444' : entry.utilization > 75 ? '#f59e0b' : '#06b6d4'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
