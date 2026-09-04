import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import api from '../../lib/axios';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs">
        <p className="text-gray-900 font-medium mb-1">{MONTHS[label - 1]}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: ₹{(p.value || 0).toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueReports() {
  const { data, isLoading } = useQuery({
    queryKey: ['revenue-report'],
    queryFn: async () => { const r = await api.get('/analytics/revenue'); return r.data.data; },
  });

  const chartData = (data?.months || []).map((m) => ({
    ...m,
    month: MONTHS[m.month - 1],
  }));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Revenue Reports</h1>
        <p className="page-subtitle">Annual revenue vs expenses analysis</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: data?.totalRevenue, color: 'text-green-400' },
          { label: 'Total Expenses', value: data?.totalExpenses, color: 'text-red-400' },
          { label: 'Net Profit', value: data?.netProfit, color: 'text-accent-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card">
            <TrendingUp size={20} className={color} />
            <div>
              <p className={`text-2xl font-bold ${color}`}>₹{(value || 0).toLocaleString()}</p>
              <p className="text-gray-700 text-sm">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="text-gray-900 font-semibold mb-6">Monthly Revenue vs Expenses</h3>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-gray-800">Loading chart...</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Profit" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
