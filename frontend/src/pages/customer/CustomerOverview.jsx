import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, TrendingUp, CheckCircle, Clock, Plus, ArrowRight, MapPin } from 'lucide-react';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';

const STATUS_MAP = {
  booking_created: { label: 'Booking Created', color: 'badge-primary' },
  driver_assigned: { label: 'Driver Assigned', color: 'badge-info' },
  picked_up: { label: 'Picked Up', color: 'badge-warning' },
  pickup_confirmed: { label: 'Pickup Confirmed', color: 'badge-warning' },
  at_origin_warehouse: { label: 'At Origin Warehouse', color: 'badge-warning' },
  in_transit: { label: 'In Transit', color: 'badge-warning' },
  at_destination_warehouse: { label: 'At Destination', color: 'badge-warning' },
  local_driver_assigned: { label: 'Local Driver Assigned', color: 'badge-info' },
  out_for_delivery: { label: 'Out for Delivery', color: 'badge-warning' },
  delivered: { label: 'Delivered', color: 'badge-success' },
  delivery_confirmed: { label: 'Confirmed', color: 'badge-success' },
  cancelled: { label: 'Cancelled', color: 'badge-error' },
};

export default function CustomerOverview() {
  const { user } = useAuthStore();
  const { data: shipmentData, isLoading } = useQuery({
    queryKey: ['customer-shipments'],
    queryFn: async () => {
      const res = await api.get('/shipments?limit=5');
      return res.data;
    },
  });

  const shipments = shipmentData?.data || [];
  const total = shipmentData?.total || 0;
  const active = shipments.filter((s) => !['delivery_confirmed', 'cancelled'].includes(s.status)).length;
  const delivered = shipments.filter((s) => s.status === 'delivery_confirmed').length;

  const stats = [
    { label: 'Total Shipments', value: total, icon: Package, color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
    { label: 'Active', value: active, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { label: 'Delivered', value: delivered, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'This Month', value: shipments.length, icon: TrendingUp, color: 'text-accent-400', bg: 'bg-accent-500/10 border-accent-500/20' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="page-subtitle">Here's an overview of your shipments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="stat-card"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{isLoading ? '—' : value}</p>
              <p className="text-gray-400 text-sm">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Link to="create-shipment" id="quick-create-shipment" className="glass-card-hover p-6 flex items-center gap-4 group">
          <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus size={22} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Create New Shipment</h3>
            <p className="text-gray-400 text-sm">Book a local or interstate shipment</p>
          </div>
          <ArrowRight size={18} className="text-gray-500 ml-auto group-hover:text-primary-400 transition-colors" />
        </Link>
        <Link to="track" id="quick-track" className="glass-card-hover p-6 flex items-center gap-4 group">
          <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <MapPin size={22} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Track a Shipment</h3>
            <p className="text-gray-400 text-sm">Real-time status and location</p>
          </div>
          <ArrowRight size={18} className="text-gray-500 ml-auto group-hover:text-accent-400 transition-colors" />
        </Link>
      </div>

      {/* Recent Shipments */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <h2 className="text-white font-semibold text-lg">Recent Shipments</h2>
          <Link to="shipments" className="text-primary-400 text-sm hover:text-primary-300 transition-colors flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : shipments.length === 0 ? (
          <div className="p-8 text-center">
            <Package size={40} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No shipments yet</p>
            <Link to="create-shipment" className="btn-primary btn-sm mt-4 inline-flex">
              Create First Shipment
            </Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tracking No.</th>
                  <th>Material</th>
                  <th>Pickup</th>
                  <th>Delivery</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <span className="font-mono text-primary-400 text-xs">{s.trackingNumber}</span>
                    </td>
                    <td className="text-white">{s.materialName}</td>
                    <td>{s.pickupAddress?.city}</td>
                    <td>{s.deliveryAddress?.city}</td>
                    <td>
                      <span className={STATUS_MAP[s.status]?.color || 'badge-neutral'}>
                        {STATUS_MAP[s.status]?.label || s.status}
                      </span>
                    </td>
                    <td>{format(new Date(s.createdAt), 'dd MMM yyyy')}</td>
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
