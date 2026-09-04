import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, ArrowDown, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { useQuery as useWHQuery } from '@tanstack/react-query';

export default function IncomingShipments() {
  const queryClient = useQueryClient();

  const { data: warehousesData } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => { const r = await api.get('/warehouses'); return r.data.data; },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['incoming-shipments'],
    queryFn: async () => {
      const r = await api.get('/shipments?status=picked_up&limit=50');
      return r.data.data;
    },
  });

  const receiveMutation = useMutation({
    mutationFn: ({ warehouseId, shipmentId }) =>
      api.put(`/warehouses/${warehouseId}/receive/${shipmentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['incoming-shipments']);
      toast.success('Shipment received at warehouse!');
    },
    onError: () => toast.error('Failed to receive shipment'),
  });

  const warehouse = warehousesData?.[0];
  const shipments = data || [];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Incoming Shipments</h1>
        <p className="page-subtitle">Shipments arriving at your warehouse</p>
      </div>

      {isLoading ? (
        <div className="glass-card p-12 text-center text-gray-800">Loading...</div>
      ) : shipments.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <ArrowDown size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-700">No incoming shipments</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shipments.map((s) => (
            <div key={s._id} className="glass-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-primary-400 text-xs">{s.trackingNumber}</span>
                  <h3 className="text-gray-900 font-semibold">{s.materialName}</h3>
                  <p className="text-gray-700 text-sm">{s.materialWeight} kg · From {s.pickupAddress?.city}</p>
                </div>
                <span className="badge-warning">{s.status.replace(/_/g, ' ')}</span>
              </div>
              {warehouse && s.status === 'picked_up' && (
                <button
                  id={`receive-${s._id}`}
                  onClick={() => receiveMutation.mutate({ warehouseId: warehouse._id, shipmentId: s._id })}
                  disabled={receiveMutation.isLoading}
                  className="btn-primary btn-sm mt-4"
                >
                  {receiveMutation.isLoading ? <Loader2 size={14} className="animate-spin" /> : <><ArrowDown size={14} /> Receive at Warehouse</>}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
