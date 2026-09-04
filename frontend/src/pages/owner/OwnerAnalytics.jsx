import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import api from '../../lib/axios';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Tooltip2 = ({ active, payload }) => {
  if (active && payload?.length) return <div className="glass-card p-3 text-xs text-gray-900">{payload[0]?.name}: {payload[0]?.value}</div>;
  return null;
};

export default function OwnerAnalytics() {
  const { data: revenue } = useQuery({ queryKey: ['revenue-analytics'], queryFn: async () => { const r = await api.get('/analytics/revenue'); return r.data.data; } });
  const { data: shipments } = useQuery({ queryKey: ['shipment-analytics'], queryFn: async () => { const r = await api.get('/analytics/shipments'); return r.data.data; } });
  const { data: drivers } = useQuery({ queryKey: ['driver-analytics'], queryFn: async () => { const r = await api.get('/analytics/drivers'); return r.data.data; } });

  const revenueChart = (revenue?.months || []).map((m) => ({ name: MONTHS[m.month - 1], Revenue: m.revenue, Expenses: m.expenses, Profit: m.profit }));
  const statusChart = (shipments?.statusStats || []).map((s) => ({ name: s._id?.replace(/_/g, ' '), value: s.count }));
  const driverStatusChart = (drivers?.statusStats || []).map((s) => ({ name: s._id, value: s.count }));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Platform Analytics</h1>
        <p className="page-subtitle">Comprehensive analytics across all operations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `₹${((revenue?.totalRevenue || 0) / 100000).toFixed(1)}L`, color: 'text-green-400' },
          { label: 'Net Profit', value: `₹${((revenue?.netProfit || 0) / 100000).toFixed(1)}L`, color: 'text-accent-400' },
          { label: 'Total Shipments', value: shipments?.totalShipments || 0, color: 'text-primary-400' },
          { label: 'Active Drivers', value: drivers?.activeDrivers || 0, color: 'text-yellow-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-gray-700 text-sm">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="glass-card p-6">
          <h3 className="text-gray-900 font-semibold mb-4">Monthly Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
              <Bar dataKey="Revenue" fill="#6366f1" radius={[3,3,0,0]} />
              <Bar dataKey="Expenses" fill="#ef4444" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Shipment Status Pie */}
        <div className="glass-card p-6">
          <h3 className="text-gray-900 font-semibold mb-4">Shipment Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusChart} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                {statusChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<Tooltip2 />} />
              <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Driver Status + Top Drivers */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-gray-900 font-semibold mb-4">Driver Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={driverStatusChart} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {driverStatusChart.map((_, i) => <Cell key={i} fill={['#10b981','#f59e0b','#6b7280'][i]} />)}
              </Pie>
              <Tooltip content={<Tooltip2 />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-gray-900 font-semibold mb-4">Top Performing Drivers</h3>
          <div className="space-y-3">
            {(drivers?.topDrivers || []).map((d, i) => (
              <div key={d._id} className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold">{i + 1}</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-gray-900 text-xs font-bold">
                  {d.user?.name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 text-sm font-medium">{d.user?.name}</p>
                </div>
                <span className="text-green-400 text-sm font-semibold">{d.completedDeliveries} deliveries</span>
              </div>
            ))}
            {(drivers?.topDrivers || []).length === 0 && <p className="text-gray-800 text-sm">No data yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
