import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Package } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../lib/axios';

export default function CustomerInvoices() {
  const { data, isLoading } = useQuery({
    queryKey: ['customer-invoices'],
    queryFn: async () => {
      const res = await api.get('/shipments?status=delivery_confirmed&limit=50');
      return res.data;
    },
  });

  const shipments = data?.data || [];

  const downloadInvoice = (shipment) => {
    const content = `
VELANX INVOICE
==============
Invoice Date: ${format(new Date(), 'dd MMM yyyy')}
Tracking No: ${shipment.trackingNumber}

SHIPMENT DETAILS
Material: ${shipment.materialName}
Weight: ${shipment.materialWeight} kg
Quantity: ${shipment.quantity}
Type: ${shipment.shipmentType}

PICKUP ADDRESS
${shipment.pickupAddress?.street}, ${shipment.pickupAddress?.city}
${shipment.pickupAddress?.state} - ${shipment.pickupAddress?.pincode}

DELIVERY ADDRESS
${shipment.deliveryAddress?.street}, ${shipment.deliveryAddress?.city}
${shipment.deliveryAddress?.state} - ${shipment.deliveryAddress?.pincode}

PRICING
Base Price: Rs.${shipment.pricing?.basePrice || 0}
Weight Charge: Rs.${shipment.pricing?.weightCharge || 0}
TOTAL: Rs.${shipment.pricing?.total || 0}

Thank you for choosing VelanX!
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VelanX-Invoice-${shipment.trackingNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Invoices</h1>
        <p className="page-subtitle">Download invoices for completed shipments</p>
      </div>

      {isLoading ? (
        <div className="glass-card p-12 text-center text-gray-800">Loading...</div>
      ) : shipments.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FileText size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-700">No invoices available yet</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice / Tracking</th>
                <th>Material</th>
                <th>Route</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s._id}>
                  <td><span className="font-mono text-primary-400 text-xs">{s.trackingNumber}</span></td>
                  <td className="text-gray-900">{s.materialName}</td>
                  <td className="text-gray-700 text-xs">{s.pickupAddress?.city} → {s.deliveryAddress?.city}</td>
                  <td className="text-gray-900 font-semibold">₹{s.pricing?.total || 0}</td>
                  <td>{format(new Date(s.createdAt), 'dd MMM yyyy')}</td>
                  <td>
                    <button
                      id={`download-invoice-${s._id}`}
                      onClick={() => downloadInvoice(s)}
                      className="btn-secondary btn-sm flex items-center gap-1.5"
                    >
                      <Download size={13} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
