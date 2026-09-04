import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { DollarSign, Plus, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const CATEGORIES = ['fuel', 'vehicle_maintenance', 'driver_advance', 'warehouse', 'office', 'miscellaneous'];

export default function ExpensesPage() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const { data, isLoading } = useQuery({ queryKey: ['expenses'], queryFn: async () => { const r = await api.get('/expenses'); return r.data.data; } });

  const createMutation = useMutation({
    mutationFn: (d) => api.post('/expenses', d),
    onSuccess: () => { queryClient.invalidateQueries(['expenses']); toast.success('Expense recorded!'); setShowForm(false); reset(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const totalExpenses = (data || []).reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="page-header mb-0">
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Track and manage operational expenses</p>
        </div>
        <button id="add-expense-btn" onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> Add Expense</button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">New Expense</h3>
            <button onClick={() => { setShowForm(false); reset(); }}><X size={18} className="text-gray-500 hover:text-white" /></button>
          </div>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="input-label">Category *</label>
              <select className="input-field" {...register('category', { required: true })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Amount (₹) *</label>
              <input type="number" className="input-field" placeholder="0" {...register('amount', { required: true, min: 1 })} />
            </div>
            <div>
              <label className="input-label">Description *</label>
              <input className="input-field" placeholder="Description..." {...register('description', { required: true })} />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={createMutation.isLoading} className="btn-primary w-full justify-center">
                {createMutation.isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Save Expense'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card p-4 mb-4 flex items-center justify-between">
        <span className="text-gray-400">Total Expenses</span>
        <span className="text-2xl font-bold text-red-400">₹{totalExpenses.toLocaleString()}</span>
      </div>

      <div className="glass-card overflow-hidden">
        {isLoading ? <div className="p-12 text-center text-gray-500">Loading...</div> : (
          <table className="data-table">
            <thead><tr><th>Category</th><th>Description</th><th>Amount</th><th>Date</th><th>Recorded By</th></tr></thead>
            <tbody>
              {(data || []).map((e) => (
                <tr key={e._id}>
                  <td><span className="badge-neutral capitalize">{e.category.replace('_', ' ')}</span></td>
                  <td className="text-white">{e.description}</td>
                  <td className="text-red-400 font-medium">₹{e.amount.toLocaleString()}</td>
                  <td>{format(new Date(e.date), 'dd MMM yyyy')}</td>
                  <td>{e.recordedBy?.name || 'System'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
