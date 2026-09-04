import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

export default function AdminDrivers() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['drivers-admin'], queryFn: async () => { const r = await api.get('/drivers'); return r.data.data; } });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/drivers/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['drivers-admin']); toast.success('Driver removed'); },
    onError: () => toast.error('Failed'),
  });

  const drivers = data || [];

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Driver Management</h1><p className="page-subtitle">Manage all registered drivers</p></div>
      <div className="glass-card overflow-hidden">
        {isLoading ? <div className="p-12 text-center text-gray-800">Loading...</div> : drivers.length === 0 ? (
          <div className="p-12 text-center"><Users size={40} className="text-gray-600 mx-auto mb-3" /><p className="text-gray-700">No drivers found</p></div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Driver</th><th>License</th><th>Status</th><th>Deliveries</th><th>Vehicle</th><th>Actions</th></tr></thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d._id}>
                  <td><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-gray-900 text-xs font-bold">{d.user?.name?.charAt(0)}</div><div><p className="text-gray-900 text-sm">{d.user?.name}</p><p className="text-gray-800 text-xs">{d.user?.phone}</p></div></div></td>
                  <td className="font-mono text-xs text-accent-400">{d.licenseNumber}</td>
                  <td><span className={d.status === 'active' ? 'badge-success' : d.status === 'busy' ? 'badge-warning' : 'badge-neutral'}>{d.status}</span></td>
                  <td className="text-gray-900 font-semibold">{d.completedDeliveries}</td>
                  <td className="text-gray-700 text-xs">{d.assignedVehicle?.vehicleNumber || '—'}</td>
                  <td>
                    <button id={`delete-driver-${d._id}`} onClick={() => { if (confirm('Remove driver?')) deleteMutation.mutate(d._id); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-700 hover:text-red-400 transition-all">
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
