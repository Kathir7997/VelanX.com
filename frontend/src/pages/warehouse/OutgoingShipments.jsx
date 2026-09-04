import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUp, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

export default function OutgoingShipments() {
  const queryClient = useQueryClient();

  const { data: warehousesData } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => { const r = await api.get('/warehouses'); return r.data.data; },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['warehouse-shipments'],
    queryFn: async () => {
      const r = await api.get('/shipments?status=at_origin_warehouse&limit=50');
      return r.data.data;
    },
  });

  const dispatchMutation = useMutation({
    mutationFn: ({ warehouseId, shipmentId }) =>
      api.put(`/warehouses/${warehouseId}/dispatch/${shipmentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['warehouse-shipments']);
      toast.success('Shipment dispatched!');
    },
    onError: () => toast.error('Failed to dispatch'),
  });

  const warehouse = warehousesData?.[0];
  const shipments = data || [];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Outgoing Shipments</h1>
        <p className="page-subtitle">Dispatch shipments from your warehouse</p>
      </div>
      {isLoading ? (
        <div className="glass-card p-12 text-center text-gray-800">Loading...</div>
      ) : shipments.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <ArrowUp size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-700">No shipments ready for dispatch</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shipments.map((s) => (
            <div key={s._id} className="glass-card p-6 flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-primary-400 text-xs">{s.trackingNumber}</span>
                <h3 className="text-gray-900 font-semibold">{s.materialName}</h3>
                <p className="text-gray-700 text-sm">{s.materialWeight} kg → {s.deliveryAddress?.city}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="badge-info">At Warehouse</span>
                {warehouse && (
                  <button
                    id={`dispatch-${s._id}`}
                    onClick={() => dispatchMutation.mutate({ warehouseId: warehouse._id, shipmentId: s._id })}
                    className="btn-accent btn-sm"
                  >
                    {dispatchMutation.isLoading ? <Loader2 size={14} className="animate-spin" /> : <><ArrowUp size={14} /> Dispatch</>}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
