import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, Users, Car, Warehouse, TrendingUp, Activity, DollarSign, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminOverview() {
  const { data: summary } = useQuery({ queryKey: ['dashboard-summary'], queryFn: async () => { const r = await api.get('/analytics/dashboard'); return r.data.data; } });
  const { data: revenue } = useQuery({ queryKey: ['revenue-summary'], queryFn: async () => { const r = await api.get('/analytics/revenue'); return r.data.data; } });

  const chartData = (revenue?.months || []).map((m) => ({
    name: MONTHS[m.month - 1],
    revenue: m.revenue,
    profit: m.profit,
    shipments: m.shipments,
  }));

  const formatRevenue = (rev) => {
    if (!rev) return '₹0';
    if (rev >= 10000000) return `₹${(rev / 10000000).toFixed(1)}Cr`;
    if (rev >= 100000) return `₹${(rev / 100000).toFixed(1)}L`;
    return `₹${rev.toLocaleString('en-IN')}`;
  };

  const stats = [
    { label: 'Total Revenue', value: formatRevenue(summary?.totalRevenue), icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', href: 'analytics' },
    { label: 'Total Shipments', value: summary?.totalShipments || 0, icon: Package, color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20', href: 'analytics' },
    { label: 'Total Users', value: summary?.totalUsers || 0, icon: Users, color: 'text-accent-400', bg: 'bg-accent-500/10 border-accent-500/20', href: 'users' },
    { label: 'Total Drivers', value: summary?.totalDrivers || 0, icon: Users, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', href: 'drivers' },
    { label: 'Total Vehicles', value: summary?.totalVehicles || 0, icon: Car, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', href: 'vehicles' },
    { label: 'Active Now', value: summary?.activeShipments || 0, icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', href: 'analytics' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Platform overview and analytics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg, href }, i) => (
          <motion.div key={label} initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="stat-card cursor-pointer group hover:-translate-y-0.5 transition-transform">
            <Link to={href} className="flex items-start justify-between w-full">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${bg}`}><Icon size={18} className={color} /></div>
                <div>
                  <p className="text-2xl font-display font-bold text-gray-900">{value}</p>
                  <p className="text-gray-700 text-sm">{label}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900 font-semibold">Revenue & Profit Trend</h2>
          <Link to="analytics" className="text-primary-400 text-sm hover:text-primary-300">View Details →</Link>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#111120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
            <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={false} name="Revenue" />
            <Line type="monotone" dataKey="profit" stroke="#06b6d4" strokeWidth={2} dot={false} name="Profit" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Manage Users', href: 'users', icon: Users, color: 'bg-primary-500' },
          { label: 'Manage Drivers', href: 'drivers', icon: Users, color: 'bg-accent-500' },
          { label: 'Manage Vehicles', href: 'vehicles', icon: Car, color: 'bg-green-500' },
          { label: 'View Analytics', href: 'analytics', icon: TrendingUp, color: 'bg-purple-500' },
        ].map(({ label, href, icon: Icon, color }) => (
          <Link key={href} to={href} id={`quick-${href}`} className="glass-card-hover p-5 flex items-center gap-3">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
              <Icon size={18} className="text-gray-900" />
            </div>
            <span className="text-gray-900 font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
