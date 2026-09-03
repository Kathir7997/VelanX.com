import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import api from '../../lib/axios';
export default function ManagerDrivers() {
  const { data, isLoading } = useQuery({ queryKey: ['drivers-list'], queryFn: async () => { const r = await api.get('/drivers'); return r.data.data; } });
  const drivers = data || [];
  return (
    <div>
      <div className="page-header"><h1 className="page-title">Driver Monitoring</h1><p className="page-subtitle">Monitor driver status and performance</p></div>
      <div className="glass-card overflow-hidden">
        {isLoading ? <div className="p-12 text-center text-gray-500">Loading...</div> : drivers.length === 0 ? (
          <div className="p-12 text-center"><Users size={40} className="text-gray-600 mx-auto mb-3" /><p className="text-gray-400">No drivers found</p></div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Driver</th><th>Contact</th><th>License</th><th>Status</th><th>Deliveries</th><th>Vehicle</th></tr></thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d._id}>
                  <td><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">{d.user?.name?.charAt(0)}</div><span className="text-white">{d.user?.name}</span></div></td>
                  <td className="text-gray-400 text-xs">{d.user?.phone}</td>
                  <td className="font-mono text-xs text-accent-400">{d.licenseNumber}</td>
                  <td><span className={d.status === 'active' ? 'badge-success' : d.status === 'busy' ? 'badge-warning' : 'badge-neutral'}>{d.status}</span></td>
                  <td className="text-white font-medium">{d.completedDeliveries}</td>
                  <td className="text-gray-400 text-xs">{d.assignedVehicle?.vehicleNumber || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
