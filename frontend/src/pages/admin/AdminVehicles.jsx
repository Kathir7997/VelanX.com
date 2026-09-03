import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Car, Plus, X, Loader2, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const VEHICLE_TYPES = ['mini_truck', 'truck', 'lorry', 'container', 'van', 'bike'];
const STATUS_OPTIONS = ['available', 'in_use', 'maintenance', 'inactive'];

export default function AdminVehicles() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { data, isLoading } = useQuery({ queryKey: ['vehicles-admin'], queryFn: async () => { const r = await api.get('/vehicles'); return r.data.data; } });
  const { data: driversData } = useQuery({ queryKey: ['drivers-admin'], queryFn: async () => { const r = await api.get('/drivers'); return r.data.data; } });

  const createMutation = useMutation({
    mutationFn: (d) => api.post('/vehicles', d),
    onSuccess: () => { queryClient.invalidateQueries(['vehicles-admin']); toast.success('Vehicle added!'); setShowForm(false); reset(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/vehicles/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['vehicles-admin']); toast.success('Vehicle deleted'); },
  });

  const assignMutation = useMutation({
    mutationFn: ({ vehicleId, driverId }) => api.put(`/vehicles/${vehicleId}/assign`, { driverId }),
    onSuccess: () => { queryClient.invalidateQueries(['vehicles-admin']); toast.success('Vehicle assigned!'); },
    onError: () => toast.error('Assignment failed'),
  });

  const vehicles = data || [];
  const drivers = driversData || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="page-header mb-0">
          <h1 className="page-title">Vehicle Management</h1>
          <p className="page-subtitle">Manage your fleet of vehicles</p>
        </div>
        <button id="add-vehicle-btn" onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> Add Vehicle</button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">Add New Vehicle</h3>
            <button onClick={() => { setShowForm(false); reset(); }}><X size={18} className="text-gray-500 hover:text-white" /></button>
          </div>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="input-label">Vehicle Number *</label>
              <input className="input-field uppercase" placeholder="TN01AB1234" {...register('vehicleNumber', { required: true })} />
            </div>
            <div>
              <label className="input-label">Vehicle Type *</label>
              <select className="input-field" {...register('vehicleType', { required: true })}>
                {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Capacity (tons) *</label>
              <input type="number" step="0.5" className="input-field" placeholder="2.5" {...register('capacity', { required: true, min: 0.1 })} />
            </div>
            <div>
              <label className="input-label">Brand</label>
              <input className="input-field" placeholder="Tata / Mahindra" {...register('brand')} />
            </div>
            <div>
              <label className="input-label">Model</label>
              <input className="input-field" placeholder="407 EX" {...register('model')} />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={createMutation.isLoading} className="btn-primary w-full justify-center">
                {createMutation.isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Fleet Summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {STATUS_OPTIONS.map((status) => (
          <div key={status} className="stat-card">
            <p className="text-xl font-bold text-white">{vehicles.filter((v) => v.status === status).length}</p>
            <p className="text-gray-400 text-xs capitalize">{status.replace('_', ' ')}</p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        {isLoading ? <div className="p-12 text-center text-gray-500">Loading...</div> : vehicles.length === 0 ? (
          <div className="p-12 text-center"><Car size={40} className="text-gray-600 mx-auto mb-3" /><p className="text-gray-400">No vehicles found</p></div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Vehicle No.</th><th>Type</th><th>Brand/Model</th><th>Capacity</th><th>Status</th><th>Assigned Driver</th><th>Assign</th><th>Actions</th></tr></thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v._id}>
                  <td className="font-mono text-primary-400 font-semibold">{v.vehicleNumber}</td>
                  <td className="capitalize"><span className="badge-neutral text-xs">{v.vehicleType?.replace('_', ' ')}</span></td>
                  <td className="text-gray-400 text-xs">{v.brand} {v.model}</td>
                  <td>{v.capacity} tons</td>
                  <td><span className={v.status === 'available' ? 'badge-success' : v.status === 'in_use' ? 'badge-warning' : 'badge-error'}>{v.status?.replace('_', ' ')}</span></td>
                  <td className="text-white text-sm">{v.assignedDriver?.user?.name || '—'}</td>
                  <td>
                    <select
                      id={`assign-driver-${v._id}`}
                      onChange={(e) => e.target.value && assignMutation.mutate({ vehicleId: v._id, driverId: e.target.value })}
                      className="bg-dark-800 border border-white/15 rounded-lg px-2 py-1 text-gray-300 text-xs"
                    >
                      <option value="">Assign Driver</option>
                      {drivers.filter((d) => d.status !== 'busy').map((d) => (
                        <option key={d._id} value={d._id}>{d.user?.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button id={`delete-vehicle-${v._id}`} onClick={() => { if (confirm('Delete this vehicle?')) deleteMutation.mutate(v._id); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all">
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
