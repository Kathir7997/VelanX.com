import React from 'react';
import { BarChart3 } from 'lucide-react';
export default function WarehouseReports() {
  return (
    <div>
      <div className="page-header"><h1 className="page-title">Warehouse Reports</h1><p className="page-subtitle">Inventory and movement reports</p></div>
      <div className="glass-card p-12 text-center">
        <BarChart3 size={40} className="text-primary-400 mx-auto mb-3" />
        <p className="text-white font-medium">Reports Coming Soon</p>
        <p className="text-gray-400 text-sm mt-1">Detailed warehouse analytics and inventory reports</p>
      </div>
    </div>
  );
}
