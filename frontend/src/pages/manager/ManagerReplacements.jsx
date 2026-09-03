import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { RefreshCw, Truck, UserCircle, CheckCircle, XCircle, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

export default function ManagerReplacements() {
  const { data: requests, refetch, isLoading } = useQuery({
    queryKey: ['replacement-requests'],
    queryFn: async () => {
      const res = await api.get('/replacements');
      return res.data;
    },
  });

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await api.put(`/replacements/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Request updated');
      refetch();
    },
    onError: () => toast.error('Failed to update request'),
  });

  if (isLoading) return <div className="text-gray-400">Loading replacement requests...</div>;

  return (
    <div className="space-y-6">
      <div className="page-header mb-0">
        <h1 className="page-title flex items-center gap-2">
          <RefreshCw className="text-primary-500" />
          Smart Replacement Requests
        </h1>
        <p className="page-subtitle">Manage driver and vehicle replacement requests</p>
      </div>

      <div className="grid gap-4">
        {requests?.length === 0 ? (
          <div className="glass-card p-12 text-center text-gray-400">No replacement requests found.</div>
        ) : (
          requests?.map((req) => (
            <div key={req._id} className="glass-card p-5">
              <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl border ${req.type === 'driver' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}>
                    {req.type === 'driver' ? <UserCircle size={24} /> : <Truck size={24} />}
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg capitalize">{req.type} Replacement</h3>
                    <p className="text-gray-400 text-sm">Reason: {req.reason.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className={`badge ${
                  req.status === 'pending' ? 'badge-warning' :
                  req.status === 'approved' ? 'badge-success' : 'badge-error'
                }`}>
                  {req.status}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-dark-800 p-3 rounded-lg border border-dark-600">
                  <p className="text-xs text-gray-500 mb-1">Original {req.type === 'driver' ? 'Driver' : 'Vehicle'}</p>
                  <p className="text-white text-sm">
                    {req.type === 'driver' ? req.originalDriver?.user?.name : req.originalVehicle?.vehicleNumber}
                  </p>
                </div>
                <div className="bg-dark-800 p-3 rounded-lg border border-dark-600">
                  <p className="text-xs text-gray-500 mb-1">Replacement Suggested</p>
                  <p className="text-white text-sm">
                     {req.type === 'driver' 
                        ? (req.replacementDriver?.user?.name || 'Nearest Available Driver') 
                        : (req.replacementVehicle?.vehicleNumber || 'Nearest Spare Vehicle')}
                  </p>
                </div>
              </div>

              {req.location && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <MapPin size={16} className="text-primary-400" />
                  {req.location.address || `${req.location.lat}, ${req.location.lng}`}
                </div>
              )}

              {req.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button
                    onClick={() => updateStatus({ id: req._id, status: 'approved' })}
                    disabled={isPending}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle size={18} /> Approve & Assign
                  </button>
                  <button
                    onClick={() => updateStatus({ id: req._id, status: 'rejected' })}
                    disabled={isPending}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2 hover:text-red-400 hover:border-red-400/50"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
