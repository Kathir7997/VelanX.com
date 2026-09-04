import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Warehouse, Plus, X, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

export default function AdminWarehouses() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { data, isLoading } = useQuery({ queryKey: ['warehouses-admin'], queryFn: async () => { const r = await api.get('/warehouses'); return r.data.data; } });

  const createMutation = useMutation({
    mutationFn: (d) => api.post('/warehouses', { ...d, location: { city: d.city, state: d.state, pincode: d.pincode, street: d.street } }),
    onSuccess: () => { queryClient.invalidateQueries(['warehouses-admin']); toast.success('Warehouse created!'); setShowForm(false); reset(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/warehouses/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['warehouses-admin']); toast.success('Warehouse deleted'); },
  });

  const warehouses = data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="page-header mb-0">
          <h1 className="page-title">Warehouse Management</h1>
          <p className="page-subtitle">Manage your warehouse network</p>
        </div>
        <button id="add-warehouse-btn" onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> Add Warehouse</button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-900 font-semibold">New Warehouse</h3>
            <button onClick={() => { setShowForm(false); reset(); }}><X size={18} className="text-gray-800 hover:text-gray-900" /></button>
          </div>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="input-label">Warehouse Name *</label>
              <input className="input-field" placeholder="Chennai Hub" {...register('warehouseName', { required: true })} />
            </div>
            <div>
              <label className="input-label">Capacity *</label>
              <input type="number" className="input-field" placeholder="1000" {...register('capacity', { required: true, min: 1 })} />
            </div>
            <div>
              <label className="input-label">Type</label>
              <select className="input-field" {...register('warehouseType')}>
                {['origin', 'destination', 'transit', 'general'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">City *</label>
              <input className="input-field" placeholder="Chennai" {...register('city', { required: true })} />
            </div>
            <div>
              <label className="input-label">State *</label>
              <input className="input-field" placeholder="Tamil Nadu" {...register('state', { required: true })} />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={createMutation.isLoading} className="btn-primary w-full justify-center">
                {createMutation.isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Create Warehouse'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        {isLoading ? <div className="p-12 text-center text-gray-800">Loading...</div> : warehouses.length === 0 ? (
          <div className="p-12 text-center"><Warehouse size={40} className="text-gray-600 mx-auto mb-3" /><p className="text-gray-700">No warehouses yet</p></div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Name</th><th>Code</th><th>Location</th><th>Type</th><th>Capacity</th><th>Load %</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {warehouses.map((w) => (
                <tr key={w._id}>
                  <td className="text-gray-900 font-medium">{w.warehouseName}</td>
                  <td><span className="font-mono text-xs text-accent-400">{w.warehouseCode}</span></td>
                  <td className="text-gray-700 text-xs">{w.location?.city}, {w.location?.state}</td>
                  <td><span className="badge-neutral text-xs">{w.warehouseType}</span></td>
                  <td>{w.capacity}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-black/5 rounded-full"><div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.min(100, (w.currentLoad / w.capacity) * 100)}%` }} /></div>
                      <span className="text-xs text-gray-700">{Math.round((w.currentLoad / w.capacity) * 100)}%</span>
                    </div>
                  </td>
                  <td><span className={w.status === 'active' ? 'badge-success' : 'badge-warning'}>{w.status}</span></td>
                  <td>
                    <button id={`delete-warehouse-${w._id}`} onClick={() => { if (confirm('Delete warehouse?')) deleteMutation.mutate(w._id); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-700 hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
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
