import React from 'react';
import { Settings, Shield, Bell, Globe, Database, Mail } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function AdminSettings() {
  const { user } = useAuthStore();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">System Settings</h1>
        <p className="page-subtitle">Configure platform settings and preferences</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Platform Info */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center border border-primary-500/20">
              <Globe size={18} className="text-primary-400" />
            </div>
            <h3 className="text-gray-900 font-semibold">Platform Info</h3>
          </div>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Platform', value: 'VelanX v1.0.0' },
              { label: 'Environment', value: 'Production' },
              { label: 'Database', value: 'MongoDB Atlas' },
              { label: 'Storage', value: 'Cloudinary' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-700">{label}</span>
                <span className="text-gray-900 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Info */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent-500/10 rounded-xl flex items-center justify-center border border-accent-500/20">
              <Shield size={18} className="text-accent-400" />
            </div>
            <h3 className="text-gray-900 font-semibold">Admin Account</h3>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-gray-900 text-2xl font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-gray-900 font-semibold">{user?.name}</p>
              <p className="text-gray-700 text-sm">{user?.email}</p>
              <span className="badge-primary mt-1">Administrator</span>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center border border-yellow-500/20">
              <Bell size={18} className="text-yellow-400" />
            </div>
            <h3 className="text-gray-900 font-semibold">Notifications</h3>
          </div>
          <div className="space-y-3">
            {['New shipment bookings', 'Delivery confirmations', 'Payment alerts', 'System alerts'].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-gray-700 text-sm">{item}</span>
                <div className="w-10 h-5 bg-primary-500 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Settings */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
              <Mail size={18} className="text-green-400" />
            </div>
            <h3 className="text-gray-900 font-semibold">Email Configuration</h3>
          </div>
          <div className="space-y-3 text-sm">
            {[
              { label: 'SMTP Host', value: 'smtp.gmail.com' },
              { label: 'SMTP Port', value: '587' },
              { label: 'From Email', value: 'noreply@velanx.com' },
              { label: 'Status', value: '✅ Connected' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-700">{label}</span>
                <span className="text-gray-900 font-medium text-xs font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
