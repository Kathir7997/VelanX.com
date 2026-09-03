import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, MapPin, Package, Truck, Warehouse, CheckCircle, Clock, XCircle } from 'lucide-react';
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

export default function TrackingPage() {
  const { trackingNumber: paramTracking } = useParams();
  const [trackId, setTrackId] = useState(paramTracking || '');
  const [query, setQuery] = useState(paramTracking || '');

  const { data: shipment, isLoading, error } = useQuery({
    queryKey: ['public-track', query],
    queryFn: async () => {
      const r = await api.get(`/shipments/track/${query}`);
      return r.data.data;
    },
    enabled: !!query,
    retry: false,
  });

  const currentStepIndex = shipment ? STATUS_STEPS.findIndex((s) => s.key === shipment.status) : -1;

  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-16 px-6">
      <div className="container-max mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl font-display font-black mb-4">
            Track Your <span className="gradient-text">Shipment</span>
          </h1>
          <p className="text-gray-400 text-lg">Enter your tracking number for real-time updates</p>
        </motion.div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="glass-card p-2 flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="public-tracking-input"
                className="input-field pl-11 bg-transparent border-0 focus:border-0"
                placeholder="Enter tracking number (e.g., VLX-ABC123-XY12)"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && trackId && setQuery(trackId)}
              />
            </div>
            <button id="public-track-btn" onClick={() => trackId && setQuery(trackId)} className="btn-primary">
              Track
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="glass-card p-12 text-center text-gray-500 max-w-2xl mx-auto">Searching...</div>
        )}

        {error && (
          <div className="glass-card p-12 text-center max-w-2xl mx-auto">
            <XCircle size={40} className="text-red-400 mx-auto mb-3" />
            <p className="text-white font-medium">Shipment Not Found</p>
            <p className="text-gray-400 text-sm mt-1">Check the tracking number and try again.</p>
          </div>
        )}

        {shipment && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
            <div className="glass-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Tracking Number</p>
                  <p className="font-mono text-primary-400 text-2xl font-bold">{shipment.trackingNumber}</p>
                </div>
                <span className={`badge ${shipment.status === 'delivery_confirmed' ? 'badge-success' : shipment.status === 'cancelled' ? 'badge-error' : 'badge-warning'} text-sm`}>
                  {shipment.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-dark-800/60 rounded-xl p-3">
                  <p className="text-gray-500 mb-0.5 flex items-center gap-1"><MapPin size={11} /> From</p>
                  <p className="text-white">{shipment.pickupAddress?.city}, {shipment.pickupAddress?.state}</p>
                </div>
                <div className="bg-dark-800/60 rounded-xl p-3">
                  <p className="text-gray-500 mb-0.5 flex items-center gap-1"><MapPin size={11} /> To</p>
                  <p className="text-white">{shipment.deliveryAddress?.city}, {shipment.deliveryAddress?.state}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-white font-semibold mb-6">Delivery Progress</h3>
              <div className="relative">
                {STATUS_STEPS.map(({ key, label, icon: Icon }, i) => {
                  const done = i <= currentStepIndex;
                  const current = i === currentStepIndex;
                  return (
                    <div key={key} className="flex items-start gap-4 mb-5 last:mb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${done ? 'bg-primary-500' : 'bg-dark-800 border border-white/15'}`}>
                          <Icon size={18} className={done ? 'text-white' : 'text-gray-600'} />
                        </div>
                        {i < STATUS_STEPS.length - 1 && <div className={`w-0.5 flex-1 mt-1 min-h-[20px] ${done ? 'bg-primary-500' : 'bg-white/10'}`} />}
                      </div>
                      <div className="pt-2">
                        <p className={`font-medium text-sm ${done ? 'text-white' : 'text-gray-600'}`}>{label}</p>
                        {current && <p className="text-primary-400 text-xs mt-0.5 flex items-center gap-1"><Clock size={10} /> Current Status</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
