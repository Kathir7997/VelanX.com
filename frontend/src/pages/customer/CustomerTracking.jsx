import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, MapPin, Package, Truck, Warehouse, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../lib/axios';

const STATUS_STEPS = [
  { key: 'booking_created', label: 'Booking Created', icon: Package },
  { key: 'driver_assigned', label: 'Driver Assigned', icon: Truck },
  { key: 'picked_up', label: 'Picked Up', icon: Truck },
  { key: 'at_origin_warehouse', label: 'Origin Warehouse', icon: Warehouse },
  { key: 'in_transit', label: 'In Transit', icon: Truck },
  { key: 'at_destination_warehouse', label: 'Destination Warehouse', icon: Warehouse },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  { key: 'delivery_confirmed', label: 'Confirmed', icon: CheckCircle },
];

export default function CustomerTracking() {
  const [trackId, setTrackId] = useState('');
  const [query, setQuery] = useState('');

  const { data: shipment, isLoading, error } = useQuery({
    queryKey: ['track', query],
    queryFn: async () => {
      const res = await api.get(`/shipments/track/${query}`);
      return res.data.data;
    },
    enabled: !!query,
    retry: false,
  });

  const currentStepIndex = shipment ? STATUS_STEPS.findIndex((s) => s.key === shipment.status) : -1;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Track Shipment</h1>
        <p className="page-subtitle">Enter your tracking number to get real-time status</p>
      </div>

      {/* Search */}
      <div className="glass-card p-6 mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              id="tracking-search"
              className="input-field pl-10"
              placeholder="Enter tracking number (e.g., VLX-ABC123-XY12)"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && trackId && setQuery(trackId)}
            />
          </div>
          <button
            id="tracking-search-btn"
            onClick={() => trackId && setQuery(trackId)}
            className="btn-primary"
          >
            Track
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="glass-card p-12 text-center text-gray-500">Searching for shipment...</div>
      )}

      {error && (
        <div className="glass-card p-12 text-center">
          <XCircle size={40} className="text-red-400 mx-auto mb-3" />
          <p className="text-white font-medium">Shipment Not Found</p>
          <p className="text-gray-400 text-sm mt-1">Please check the tracking number and try again</p>
        </div>
      )}

      {shipment && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Shipment Info */}
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-gray-400 text-sm">Tracking Number</p>
                <p className="font-mono text-primary-400 text-xl font-bold">{shipment.trackingNumber}</p>
              </div>
              <span className={`badge badge-${shipment.status === 'delivery_confirmed' ? 'success' : shipment.status === 'cancelled' ? 'error' : 'warning'} text-sm`}>
                {shipment.status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Material</p>
                <p className="text-white font-medium">{shipment.materialName}</p>
              </div>
              <div>
                <p className="text-gray-500">From</p>
                <p className="text-white">{shipment.pickupAddress?.city}, {shipment.pickupAddress?.state}</p>
              </div>
              <div>
                <p className="text-gray-500">To</p>
                <p className="text-white">{shipment.deliveryAddress?.city}, {shipment.deliveryAddress?.state}</p>
              </div>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="glass-card p-6">
            <h3 className="text-white font-semibold mb-6">Delivery Progress</h3>
            <div className="relative">
              {STATUS_STEPS.map(({ key, label, icon: Icon }, i) => {
                const isCompleted = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div key={key} className="flex items-start gap-4 mb-6 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isCompleted ? 'bg-primary-500 shadow-glow-primary' : 'bg-dark-800 border border-white/15'
                      }`}>
                        <Icon size={18} className={isCompleted ? 'text-white' : 'text-gray-600'} />
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`w-0.5 flex-1 mt-1 min-h-[24px] ${isCompleted ? 'bg-primary-500' : 'bg-white/10'}`} />
                      )}
                    </div>
                    <div className="pt-2">
                      <p className={`font-medium ${isCompleted ? 'text-white' : 'text-gray-600'}`}>{label}</p>
                      {isCurrent && (
                        <p className="text-primary-400 text-xs mt-0.5 flex items-center gap-1">
                          <Clock size={11} /> Current Status
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Driver Info */}
          {shipment.assignedDriver && (
            <div className="glass-card p-6">
              <h3 className="text-white font-semibold mb-4">Assigned Driver</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                  {shipment.assignedDriver.user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium">{shipment.assignedDriver.user?.name}</p>
                  <p className="text-gray-400 text-sm">{shipment.assignedDriver.user?.phone}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
