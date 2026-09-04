import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Users } from 'lucide-react';
import api from '../../lib/axios';

export default function AccountantOverview() {
  const { data: expenses } = useQuery({
    queryKey: ['expenses-summary'],
    queryFn: async () => { const r = await api.get('/expenses'); return r.data.data; },
  });

  const { data: salaries } = useQuery({
    queryKey: ['salaries-summary'],
    queryFn: async () => { const r = await api.get('/salary'); return r.data.data; },
  });

  const { data: revenue } = useQuery({
    queryKey: ['revenue-summary'],
    queryFn: async () => { const r = await api.get('/analytics/revenue'); return r.data.data; },
  });

  const totalExpenses = (expenses || []).reduce((sum, e) => sum + e.amount, 0);
  const totalSalary = (salaries || []).reduce((sum, s) => sum + (s.netSalary || 0), 0);
  const totalRevenue = revenue?.totalRevenue || 0;

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Total Expenses', value: `₹${totalExpenses.toLocaleString()}`, icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    { label: 'Payroll This Month', value: `₹${totalSalary.toLocaleString()}`, icon: Wallet, color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
    { label: 'Net Profit', value: `₹${(totalRevenue - totalExpenses - totalSalary).toLocaleString()}`, icon: DollarSign, color: 'text-accent-400', bg: 'bg-accent-500/10 border-accent-500/20' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Accountant Dashboard</h1>
        <p className="page-subtitle">Financial overview and management</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="stat-card">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${bg}`}><Icon size={18} className={color} /></div>
            <div>
              <p className="text-xl font-display font-bold text-white">{value}</p>
              <p className="text-gray-400 text-sm">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Recent Expenses */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/10"><h2 className="text-white font-semibold">Recent Expenses</h2></div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>Category</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {(expenses || []).slice(0, 5).map((e) => (
                <tr key={e._id}>
                  <td><span className="capitalize badge-neutral">{e.category.replace('_', ' ')}</span></td>
                  <td className="text-white">{e.description}</td>
                  <td className="text-white font-medium">₹{e.amount.toLocaleString()}</td>
                  <td><span className={e.status === 'approved' ? 'badge-success' : 'badge-warning'}>{e.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
