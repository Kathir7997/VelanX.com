import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Camera, Check, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

export default function UploadPODModal({ shipmentId, onClose }) {
  const queryClient = useQueryClient();
  const [productPhoto, setProductPhoto] = useState(null);
  const [signature, setSignature] = useState('');
  const [otp, setOtp] = useState('');
  const canvasRef = useRef(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/pods', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('POD Submitted successfully');
      queryClient.invalidateQueries(['driver-pods']);
      queryClient.invalidateQueries(['driver-shipments']);
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to submit POD');
    },
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mocking simple drawing on canvas for signature
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if(canvasRef.current) {
        setSignature(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productPhoto) return toast.error('Product photo is required');
    if (!signature) return toast.error('Receiver signature is required');
    
    // In a real app, verify OTP first
    mutate({
      shipmentId,
      productPhoto,
      receiverSignature: signature,
      otpVerified: otp.length === 6,
      notes: 'Delivered successfully via Driver app',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-dark-700 flex justify-between items-center bg-dark-800">
          <h2 className="text-lg font-semibold text-white">Upload Proof of Delivery</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Product Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Product Photo</label>
              <div className="flex items-center justify-center w-full">
                {productPhoto ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                    <img src={productPhoto} alt="Product" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => setProductPhoto(null)} className="btn-secondary text-sm">Remove</button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dark-600 border-dashed rounded-xl cursor-pointer hover:bg-dark-800 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-primary-400">Click to upload</span> or take photo</p>
                    </div>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
            </div>

            {/* Receiver Signature */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-gray-300">Receiver Signature</label>
                <button type="button" onClick={clearSignature} className="text-xs text-red-400 hover:text-red-300">Clear</button>
              </div>
              <div className="bg-white rounded-xl overflow-hidden border border-dark-600">
                <canvas
                  ref={canvasRef}
                  width={450}
                  height={150}
                  className="w-full h-[150px] cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                  onTouchStart={(e) => {
                      // basic touch support
                      const touch = e.touches[0];
                      startDrawing({clientX: touch.clientX, clientY: touch.clientY});
                  }}
                  onTouchMove={(e) => {
                      const touch = e.touches[0];
                      draw({clientX: touch.clientX, clientY: touch.clientY});
                  }}
                  onTouchEnd={stopDrawing}
                />
              </div>
            </div>

            {/* OTP Verification */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Receiver OTP (Optional)</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="input-field w-full text-center tracking-[0.5em] font-mono text-lg"
                maxLength={6}
              />
            </div>

            <div className="pt-4 border-t border-dark-700 flex gap-3">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={isPending} className="btn-primary flex-1 flex justify-center items-center gap-2">
                {isPending ? 'Submitting...' : <><Upload size={18} /> Submit POD</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
