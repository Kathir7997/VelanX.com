import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Warehouse, AlertTriangle, ArrowRightLeft, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../../lib/axios';

export default function WarehouseLoadBalancing() {
  const { data, isLoading } = useQuery({
    queryKey: ['warehouse-balancing'],
    queryFn: async () => {
      // Re-using the logistics command center endpoint for simplicity, 
      // but in a real scenario, this would call a specific load balancing algorithm endpoint
      const res = await api.get('/logistics/command-center');
      return res.data;
    },
  });

  if (isLoading) return <div className="text-gray-400">Loading Warehouse Data...</div>;

  const warehouses = data?.warehouseStats || [];
  
  // Simple suggestion logic
  const overloaded = warehouses.filter(w => w.utilization >= 85);
  const underutilized = warehouses.filter(w => w.utilization < 50);

  return (
    <div className="space-y-6">
      <div className="page-header mb-0">
        <h1 className="page-title flex items-center gap-2">
          <ArrowRightLeft className="text-primary-500" />
          Multi-Warehouse Load Balancing
        </h1>
        <p className="page-subtitle">Track capacities and optimize shipment distribution</p>
      </div>

      <div className="glass-card p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">Capacity Utilization Tracking</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={warehouses} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#9ca3af' }} width={120} />
            <Tooltip contentStyle={{ background: '#111120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
            <Bar dataKey="utilization" radius={[0, 4, 4, 0]} barSize={24}>
              {warehouses.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.utilization > 85 ? '#ef4444' : entry.utilization > 60 ? '#f59e0b' : '#10b981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Capacity Alerts */}
        <div className="glass-card p-6 border-red-500/20">
          <h3 className="text-white font-semibold flex items-center gap-2 mb-4 text-red-400">
            <AlertTriangle size={20} /> Capacity Warnings
          </h3>
          {overloaded.length > 0 ? (
            <div className="space-y-4">
              {overloaded.map(w => (
                <div key={w.name} className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-white">{w.name}</span>
                    <span className="text-red-400">{w.utilization}% Full</span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${w.utilization}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-gray-400 text-sm">No warehouses are currently near maximum capacity.</p>
          )}
        </div>

        {/* Load Balancing Suggestions */}
        <div className="glass-card p-6 border-primary-500/20">
          <h3 className="text-white font-semibold flex items-center gap-2 mb-4 text-primary-400">
            <TrendingDown size={20} /> Balancing Recommendations
          </h3>
          {overloaded.length > 0 && underutilized.length > 0 ? (
            <div className="space-y-4">
              {overloaded.map((over, idx) => (
                <div key={idx} className="p-4 bg-dark-800 rounded-xl border border-dark-600 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Divert incoming shipments from</p>
                    <p className="text-white font-medium">{over.name}</p>
                  </div>
                  <ArrowRightLeft className="text-primary-500 shrink-0" />
                  <div className="flex-1 text-right">
                    <p className="text-sm text-gray-400">Route to</p>
                    <p className="text-white font-medium">{underutilized[idx % underutilized.length].name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              Load is currently balanced. No diversions recommended at this time.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
