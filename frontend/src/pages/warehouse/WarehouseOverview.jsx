import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Warehouse, Package, PackageCheck, PackageX, BarChart3 } from 'lucide-react';
import api from '../../lib/axios';

export default function WarehouseOverview() {
  const { data: warehouses } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => { const r = await api.get('/warehouses'); return r.data.data; },
  });
  const { data: shipments } = useQuery({
    queryKey: ['wh-shipments'],
    queryFn: async () => { const r = await api.get('/shipments?limit=100'); return r.data.data; },
  });

  const incoming = (shipments || []).filter((s) => ['driver_assigned', 'picked_up'].includes(s.status)).length;
  const atWarehouse = (shipments || []).filter((s) => ['at_origin_warehouse', 'at_destination_warehouse'].includes(s.status)).length;
  const outgoing = (shipments || []).filter((s) => s.status === 'in_transit').length;

  const stats = [
    { label: 'My Warehouses', value: warehouses?.length || 0, icon: Warehouse, color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
    { label: 'Incoming', value: incoming, icon: Package, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { label: 'At Warehouse', value: atWarehouse, icon: PackageCheck, color: 'text-accent-400', bg: 'bg-accent-500/10 border-accent-500/20' },
    { label: 'Outgoing', value: outgoing, icon: PackageX, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Warehouse Overview</h1>
        <p className="page-subtitle">Monitor inventory and shipment flow</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="stat-card">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${bg}`}><Icon size={18} className={color} /></div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{value}</p>
              <p className="text-gray-400 text-sm">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Warehouse List */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/10"><h2 className="text-white font-semibold">Warehouses</h2></div>
        {(warehouses || []).length === 0 ? (
          <div className="p-12 text-center"><Warehouse size={40} className="text-gray-600 mx-auto mb-3" /><p className="text-gray-400">No warehouses assigned</p></div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Warehouse</th><th>Location</th><th>Capacity</th><th>Load</th><th>Status</th></tr></thead>
              <tbody>
                {(warehouses || []).map((w) => (
                  <tr key={w._id}>
                    <td className="text-white font-medium">{w.warehouseName}</td>
                    <td>{w.location?.city}, {w.location?.state}</td>
                    <td>{w.capacity}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.min(100, (w.currentLoad / w.capacity) * 100)}%` }} />
                        </div>
                        <span className="text-xs text-gray-400">{w.currentLoad}/{w.capacity}</span>
                      </div>
                    </td>
                    <td><span className={w.status === 'active' ? 'badge-success' : 'badge-warning'}>{w.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
