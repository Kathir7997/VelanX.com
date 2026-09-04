import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Warehouse } from 'lucide-react';
import api from '../../lib/axios';
export default function ManagerWarehouses() {
  const { data, isLoading } = useQuery({ queryKey: ['warehouses'], queryFn: async () => { const r = await api.get('/warehouses'); return r.data.data; } });
  return (
    <div>
      <div className="page-header"><h1 className="page-title">Warehouse Network</h1><p className="page-subtitle">Monitor all warehouse operations</p></div>
      <div className="glass-card overflow-hidden">
        {isLoading ? <div className="p-12 text-center text-gray-500">Loading...</div> : (data || []).length === 0 ? (
          <div className="p-12 text-center"><Warehouse size={40} className="text-gray-600 mx-auto mb-3" /><p className="text-gray-400">No warehouses found</p></div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Warehouse</th><th>Code</th><th>Location</th><th>Manager</th><th>Capacity</th><th>Load</th><th>Status</th></tr></thead>
            <tbody>
              {(data || []).map((w) => (
                <tr key={w._id}>
                  <td className="text-white font-medium">{w.warehouseName}</td>
                  <td><span className="font-mono text-xs text-accent-400">{w.warehouseCode}</span></td>
                  <td>{w.location?.city}, {w.location?.state}</td>
                  <td>{w.manager?.name || '—'}</td>
                  <td>{w.capacity}</td>
                  <td><div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-white/10 rounded-full"><div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.min(100, (w.currentLoad / w.capacity) * 100)}%` }} /></div><span className="text-xs text-gray-400">{w.currentLoad}</span></div></td>
                  <td><span className={w.status === 'active' ? 'badge-success' : 'badge-warning'}>{w.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
