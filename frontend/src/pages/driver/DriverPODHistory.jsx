import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Image as ImageIcon, MapPin, Calendar, CheckCircle } from 'lucide-react';
import api from '../../lib/axios';

export default function DriverPODHistory() {
  const { data: pods, isLoading } = useQuery({
    queryKey: ['driver-pods'],
    queryFn: async () => {
      const res = await api.get('/pods');
      return res.data;
    },
  });

  if (isLoading) return <div className="text-gray-700">Loading POD History...</div>;

  return (
    <div className="space-y-6">
      <div className="page-header mb-0">
        <h1 className="page-title flex items-center gap-2">
          <FileText className="text-primary-500" />
          Proof of Delivery History
        </h1>
        <p className="page-subtitle">View your completed delivery records</p>
      </div>

      {pods?.length === 0 ? (
        <div className="glass-card p-12 text-center flex flex-col items-center">
          <FileText size={48} className="text-gray-600 mb-4" />
          <h3 className="text-xl text-gray-900 font-semibold">No PODs Found</h3>
          <p className="text-gray-700">You haven't submitted any proofs of delivery yet.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {pods?.map((pod) => (
            <div key={pod._id} className="glass-card p-6">
              <div className="flex justify-between items-start mb-4 border-b border-black/5 pb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    Shipment: {pod.shipment?.trackingNumber || 'Unknown'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar size={14} />
                    {new Date(pod.deliveredAt).toLocaleString()}
                  </div>
                </div>
                <span className="badge badge-success flex items-center gap-1">
                  <CheckCircle size={14} />
                  Verified
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary-400 shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-700">Delivery Address</p>
                    <p className="text-gray-900">
                      {pod.shipment?.deliveryAddress?.street}, {pod.shipment?.deliveryAddress?.city}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-700 mb-2 flex items-center gap-1">
                      <ImageIcon size={14} /> Product Photo
                    </p>
                    <div className="w-full h-32 bg-gray-200 rounded-lg border border-dark-600 overflow-hidden">
                      {pod.productPhoto ? (
                        <img src={pod.productPhoto} alt="Product" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Photo</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 mb-2 flex items-center gap-1">
                      <FileText size={14} /> Signature
                    </p>
                    <div className="w-full h-32 bg-white rounded-lg border border-dark-600 overflow-hidden flex items-center justify-center p-2">
                      {pod.receiverSignature ? (
                        <img src={pod.receiverSignature} alt="Signature" className="max-w-full max-h-full" />
                      ) : (
                        <div className="text-gray-700 text-xs">No Signature</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {pod.otpVerified && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm flex items-center gap-2">
                    <CheckCircle size={16} /> OTP Verification Successful
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
