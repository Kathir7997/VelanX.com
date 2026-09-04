import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../lib/axios';
export default function ManagerShipments() {
  const { data, isLoading } = useQuery({ queryKey: ['all-shipments'], queryFn: async () => { const r = await api.get('/shipments?limit=50'); return r.data.data; } });
  const shipments = data || [];
  return (
    <div>
      <div className="page-header"><h1 className="page-title">Shipment Monitoring</h1><p className="page-subtitle">Monitor all active shipments</p></div>
      <div className="glass-card overflow-hidden">
        {isLoading ? <div className="p-12 text-center text-gray-800">Loading...</div> : shipments.length === 0 ? (
          <div className="p-12 text-center"><ClipboardList size={40} className="text-gray-600 mx-auto mb-3" /><p className="text-gray-700">No shipments</p></div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Tracking</th><th>Customer</th><th>Type</th><th>From</th><th>To</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s._id}>
                  <td><span className="font-mono text-primary-400 text-xs">{s.trackingNumber}</span></td>
                  <td className="text-gray-900">{s.customer?.name}</td>
                  <td><span className="badge-neutral text-xs">{s.shipmentType}</span></td>
                  <td>{s.pickupAddress?.city}</td>
                  <td>{s.deliveryAddress?.city}</td>
                  <td><span className="badge-warning text-xs">{s.status?.replace(/_/g, ' ')}</span></td>
                  <td className="text-xs">{format(new Date(s.createdAt), 'dd MMM yy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
