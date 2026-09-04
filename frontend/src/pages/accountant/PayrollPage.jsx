import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Wallet, Plus, X, Loader2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

export default function PayrollPage() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data: users } = useQuery({ queryKey: ['staff-users'], queryFn: async () => { const r = await api.get('/users?role=driver'); return r.data.data; } });
  const { data, isLoading } = useQuery({ queryKey: ['salaries'], queryFn: async () => { const r = await api.get('/salary'); return r.data.data; } });

  const createMutation = useMutation({
    mutationFn: (d) => api.post('/salary', d),
    onSuccess: () => { queryClient.invalidateQueries(['salaries']); toast.success('Salary record created!'); setShowForm(false); reset(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const payMutation = useMutation({
    mutationFn: (id) => api.put(`/salary/${id}/pay`),
    onSuccess: () => { queryClient.invalidateQueries(['salaries']); toast.success('Marked as paid!'); },
  });

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="page-header mb-0">
          <h1 className="page-title">Payroll Management</h1>
          <p className="page-subtitle">Manage employee salaries and payments</p>
        </div>
        <button id="add-salary-btn" onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} /> Add Record
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-900 font-semibold">New Salary Record</h3>
            <button onClick={() => { setShowForm(false); reset(); }}><X size={18} className="text-gray-800 hover:text-gray-900" /></button>
          </div>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="input-label">Employee *</label>
              <select className="input-field" {...register('employee', { required: true })}>
                <option value="">Select employee</option>
                {(users || []).map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Role *</label>
              <select className="input-field" {...register('role', { required: true })}>
                <option value="">Select role</option>
                {['driver','warehouse_manager','accountant','general_manager'].map((r) => <option key={r} value={r}>{r.replace('_',' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Basic Salary (₹) *</label>
              <input type="number" className="input-field" placeholder="25000" {...register('basicSalary', { required: true, min: 0 })} />
            </div>
            <div>
              <label className="input-label">Month *</label>
              <select className="input-field" {...register('month', { required: true })}>
                {MONTHS.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Year *</label>
              <input type="number" className="input-field" defaultValue={new Date().getFullYear()} {...register('year', { required: true })} />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={createMutation.isLoading} className="btn-primary w-full justify-center">
                {createMutation.isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Create Record'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        {isLoading ? <div className="p-12 text-center text-gray-800">Loading...</div> : (
          <table className="data-table">
            <thead><tr><th>Employee</th><th>Role</th><th>Month/Year</th><th>Basic</th><th>Net Salary</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {(data || []).map((s) => (
                <tr key={s._id}>
                  <td className="text-gray-900">{s.employee?.name}</td>
                  <td className="capitalize">{s.role?.replace('_', ' ')}</td>
                  <td>{MONTHS[s.month - 1]} {s.year}</td>
                  <td>₹{s.basicSalary?.toLocaleString()}</td>
                  <td className="text-gray-900 font-semibold">₹{s.netSalary?.toLocaleString()}</td>
                  <td><span className={s.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}>{s.paymentStatus}</span></td>
                  <td>
                    {s.paymentStatus !== 'paid' && (
                      <button id={`pay-${s._id}`} onClick={() => payMutation.mutate(s._id)} className="btn-primary btn-sm">
                        <CheckCircle size={13} /> Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
