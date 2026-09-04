import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PackageCheck, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../lib/axios';

export default function DriverDeliveries() {
  const { data, isLoading } = useQuery({
    queryKey: ['driver-deliveries'],
    queryFn: async () => {
      const res = await api.get('/shipments?status=delivery_confirmed');
      return res.data;
    },
  });
  const deliveries = data?.data || [];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Completed Deliveries</h1>
        <p className="page-subtitle">Your delivery history and records</p>
      </div>
      {isLoading ? (
        <div className="glass-card p-12 text-center text-gray-500">Loading...</div>
      ) : deliveries.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <PackageCheck size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No completed deliveries yet</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tracking No.</th>
                <th>Material</th>
                <th>From → To</th>
                <th>Weight</th>
                <th>Delivered</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((s) => (
                <tr key={s._id}>
                  <td><span className="font-mono text-primary-400 text-xs">{s.trackingNumber}</span></td>
                  <td className="text-white">{s.materialName}</td>
                  <td className="text-gray-400 text-xs">{s.pickupAddress?.city} → {s.deliveryAddress?.city}</td>
                  <td>{s.materialWeight} kg</td>
                  <td>{s.actualDelivery ? format(new Date(s.actualDelivery), 'dd MMM yyyy') : '—'}</td>
                  <td><span className="badge-success flex items-center gap-1 w-fit"><CheckCircle size={11} /> Confirmed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
