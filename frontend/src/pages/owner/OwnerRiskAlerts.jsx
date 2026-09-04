import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ShieldAlert, RefreshCw, AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const SEVERITY_STYLES = {
  critical: 'bg-red-500/10 text-red-500 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

const SEVERITY_ICONS = {
  critical: AlertCircle,
  high: AlertTriangle,
  medium: AlertTriangle,
  low: Info,
};

export default function OwnerRiskAlerts() {
  const { data: alerts, refetch, isLoading } = useQuery({
    queryKey: ['risk-alerts'],
    queryFn: async () => {
      const res = await api.get('/risks');
      return res.data;
    },
  });

  const { mutate: generateAlerts, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      const res = await api.post('/risks/generate');
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Generated ${data.count} risk alerts`);
      refetch();
    },
    onError: () => toast.error('Failed to generate alerts'),
  });

  const { mutate: resolveAlert } = useMutation({
    mutationFn: async (id) => {
      const res = await api.put(`/risks/${id}/status`, { status: 'resolved' });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Alert resolved');
      refetch();
    },
    onError: () => toast.error('Failed to resolve alert'),
  });

  return (
    <div>
      <div className="page-header flex justify-between items-end">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ShieldAlert className="text-primary-500" />
            Business Risk Alerts
          </h1>
          <p className="page-subtitle">Monitor and mitigate enterprise risks</p>
        </div>
        <button
          onClick={() => generateAlerts()}
          disabled={isGenerating}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} />
          {isGenerating ? 'Scanning...' : 'Run Risk Scan'}
        </button>
      </div>

      {isLoading ? (
        <div className="text-gray-700">Loading risk alerts...</div>
      ) : alerts?.length === 0 ? (
        <div className="glass-card p-12 text-center flex flex-col items-center">
          <CheckCircle size={48} className="text-green-500 mb-4" />
          <h3 className="text-xl text-gray-900 font-semibold">No Active Risks</h3>
          <p className="text-gray-700">Your enterprise logistics are running smoothly.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {alerts?.map((alert) => {
            const Icon = SEVERITY_ICONS[alert.severity] || Info;
            return (
              <div key={alert._id} className="glass-card p-4 flex items-start gap-4">
                <div className={`p-3 rounded-xl border ${SEVERITY_STYLES[alert.severity]}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-gray-900 font-medium text-lg">
                        {alert.type.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </h3>
                      <p className="text-gray-700 mt-1">{alert.message}</p>
                      {alert.dueDate && (
                        <p className="text-sm text-gray-800 mt-2">
                          Due Date: {new Date(alert.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {alert.status === 'active' && (
                      <button
                        onClick={() => resolveAlert(alert._id)}
                        className="px-4 py-2 bg-gray-200 hover:bg-dark-700 text-gray-900 text-sm rounded-lg border border-dark-600 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
