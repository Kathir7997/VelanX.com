import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Navigation, MapPin, Phone, Package, Truck, ArrowRight, Loader2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import UploadPODModal from '../../components/driver/UploadPODModal';

export default function DriverAssignments() {
  const queryClient = useQueryClient();
  const [podModalShipmentId, setPodModalShipmentId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['driver-assignments'],
    queryFn: async () => {
      const res = await api.get('/drivers/assignments');
      return res.data.data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => api.put(`/shipments/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['driver-assignments']);
      toast.success('Status updated!');
    },
    onError: () => toast.error('Failed to update'),
  });

  const assignments = data || [];

  const getNextStatus = (current) => {
    const flow = {
      driver_assigned: 'picked_up',
      picked_up: 'out_for_delivery',
      out_for_delivery: 'delivered',
    };
    return flow[current];
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Assignments</h1>
        <p className="page-subtitle">Manage your current delivery assignments</p>
      </div>

      {isLoading ? (
        <div className="glass-card p-12 text-center text-gray-500">Loading...</div>
      ) : assignments.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Navigation size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No assignments at the moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((s, i) => (
            <motion.div
              key={s._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="font-mono text-primary-400 text-xs">{s.trackingNumber}</span>
                  <h3 className="text-white font-semibold text-lg">{s.materialName}</h3>
                  <p className="text-gray-400 text-sm">{s.materialWeight} kg · {s.quantity} units</p>
                </div>
                <span className="badge-warning">{s.status.replace(/_/g, ' ')}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-dark-800/60 rounded-xl p-3">
                  <p className="text-green-400 text-xs font-semibold mb-1 flex items-center gap-1"><MapPin size={11} /> PICKUP</p>
                  <p className="text-white text-sm">{s.pickupAddress?.street}</p>
                  <p className="text-gray-400 text-xs">{s.pickupAddress?.city}, {s.pickupAddress?.state}</p>
                </div>
                <div className="bg-dark-800/60 rounded-xl p-3">
                  <p className="text-red-400 text-xs font-semibold mb-1 flex items-center gap-1"><MapPin size={11} /> DELIVERY</p>
                  <p className="text-white text-sm">{s.deliveryAddress?.street}</p>
                  <p className="text-gray-400 text-xs">{s.deliveryAddress?.city}, {s.deliveryAddress?.state}</p>
                </div>
              </div>

              {s.customer && (
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                  <Phone size={13} className="text-primary-400" />
                  Customer: {s.customer.name} · {s.customer.phone}
                </div>
              )}

              {getNextStatus(s.status) === 'delivered' ? (
                <button
                  onClick={() => setPodModalShipmentId(s._id)}
                  className="btn-primary btn-sm flex items-center gap-2 bg-green-500 hover:bg-green-600"
                >
                  <Upload size={14} /> Complete Delivery & Upload POD
                </button>
              ) : getNextStatus(s.status) ? (
                <button
                  id={`advance-status-${s._id}`}
                  onClick={() => updateStatus.mutate({ id: s._id, status: getNextStatus(s.status) })}
                  disabled={updateStatus.isPending}
                  className="btn-primary btn-sm"
                >
                  {updateStatus.isPending ? <Loader2 size={14} className="animate-spin" /> : (
                    <>Mark as {getNextStatus(s.status).replace(/_/g, ' ')} <ArrowRight size={14} /></>
                  )}
                </button>
              ) : null}
            </motion.div>
          ))}
        </div>
      )}
      {podModalShipmentId && (
        <UploadPODModal 
          shipmentId={podModalShipmentId} 
          onClose={() => setPodModalShipmentId(null)} 
        />
      )}
    </div>
  );
}
