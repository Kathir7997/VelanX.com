import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, Search, Filter, Eye } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../lib/axios';
import { Link } from 'react-router-dom';

const STATUS_MAP = {
  booking_created: { label: 'Booking Created', color: 'badge-primary' },
  driver_assigned: { label: 'Driver Assigned', color: 'badge-info' },
  picked_up: { label: 'Picked Up', color: 'badge-warning' },
  at_origin_warehouse: { label: 'At Origin WH', color: 'badge-warning' },
  in_transit: { label: 'In Transit', color: 'badge-warning' },
  at_destination_warehouse: { label: 'At Dest. WH', color: 'badge-warning' },
  out_for_delivery: { label: 'Out for Delivery', color: 'badge-warning' },
  delivered: { label: 'Delivered', color: 'badge-success' },
  delivery_confirmed: { label: 'Confirmed ✓', color: 'badge-success' },
  cancelled: { label: 'Cancelled', color: 'badge-error' },
};

export default function CustomerShipments() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['shipments', page, search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      const res = await api.get(`/shipments?${params}`);
      return res.data;
    },
  });

  const shipments = data?.data || [];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Shipments</h1>
        <p className="page-subtitle">Track and manage all your shipments</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-800" />
          <input
            id="shipments-search"
            className="input-field pl-10"
            placeholder="Search by tracking number or material..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          id="shipments-status-filter"
          className="input-field w-full sm:w-52"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          {Object.entries(STATUS_MAP).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-800">Loading shipments...</div>
        ) : shipments.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={40} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-700">No shipments found</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tracking No.</th>
                    <th>Material</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((s) => (
                    <motion.tr
                      key={s._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td><span className="font-mono text-primary-400 text-xs">{s.trackingNumber}</span></td>
                      <td className="text-gray-900 font-medium">{s.materialName}</td>
                      <td><span className={s.shipmentType === 'interstate' ? 'badge-primary' : 'badge-neutral'}>{s.shipmentType}</span></td>
                      <td>{s.pickupAddress?.city}</td>
                      <td>{s.deliveryAddress?.city}</td>
                      <td className="text-gray-900 font-medium">₹{s.pricing?.total || 0}</td>
                      <td><span className={STATUS_MAP[s.status]?.color || 'badge-neutral'}>{STATUS_MAP[s.status]?.label || s.status}</span></td>
                      <td>{format(new Date(s.createdAt), 'dd MMM yy')}</td>
                      <td>
                        <Link to={`/dashboard/customer/track?id=${s._id}`} id={`view-shipment-${s._id}`} className="p-1.5 rounded-lg hover:bg-black/5 text-gray-800 hover:text-gray-900 transition-all inline-flex">
                          <Eye size={15} />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {data?.pages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-black/10">
                <p className="text-gray-800 text-sm">Page {data.currentPage} of {data.pages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="btn-secondary btn-sm disabled:opacity-40">Prev</button>
                  <button onClick={() => setPage((p) => p + 1)} disabled={page >= data.pages} className="btn-secondary btn-sm disabled:opacity-40">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
