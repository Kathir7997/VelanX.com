import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, MapPin, Truck, CheckCircle, Upload, X, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const STEPS = [
  { id: 1, title: 'Shipment Details', icon: Package },
  { id: 2, title: 'Addresses', icon: MapPin },
  { id: 3, title: 'Receiver Info', icon: Truck },
  { id: 4, title: 'Review & Submit', icon: CheckCircle },
];

export default function CreateShipment() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, getValues, trigger, formState: { errors } } = useForm({
    defaultValues: { shipmentType: 'local' },
  });

  const shipmentType = watch('shipmentType');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (i) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  const nextStep = async () => {
    let fields = [];
    if (step === 1) fields = ['materialName', 'materialWeight', 'quantity', 'shipmentType'];
    if (step === 2) fields = [
      'pickupStreet', 'pickupCity', 'pickupState', 'pickupPincode',
      'deliveryStreet', 'deliveryCity', 'deliveryState', 'deliveryPincode',
    ];
    if (step === 3) fields = ['receiverName', 'receiverPhone'];
    const valid = await trigger(fields);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('materialName', data.materialName);
      formData.append('materialWeight', data.materialWeight);
      formData.append('quantity', data.quantity);
      formData.append('shipmentType', data.shipmentType);
      formData.append('receiverName', data.receiverName);
      formData.append('receiverPhone', data.receiverPhone);
      formData.append('specialInstructions', data.specialInstructions || '');
      formData.append('pickupAddress', JSON.stringify({
        street: data.pickupStreet, city: data.pickupCity,
        state: data.pickupState, pincode: data.pickupPincode,
      }));
      formData.append('deliveryAddress', JSON.stringify({
        street: data.deliveryStreet, city: data.deliveryCity,
        state: data.deliveryState, pincode: data.deliveryPincode,
      }));
      images.forEach((img) => formData.append('images', img));

      await api.post('/shipments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Shipment created successfully!');
      navigate('/dashboard/customer/shipments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  const values = getValues();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Create New Shipment</h1>
        <p className="page-subtitle">Fill in the details to book your shipment</p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center mb-10">
        {STEPS.map(({ id, title, icon: Icon }, i) => (
          <React.Fragment key={id}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                step > id ? 'bg-green-500' : step === id ? 'bg-primary-500 shadow-glow-primary' : 'bg-white/10'
              }`}>
                {step > id ? <CheckCircle size={18} className="text-white" /> : <Icon size={18} className={step === id ? 'text-white' : 'text-gray-500'} />}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step >= id ? 'text-white' : 'text-gray-500'}`}>{title}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${step > id ? 'bg-green-500' : 'bg-white/10'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* Step 1 */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-8 space-y-5">
              <h2 className="text-white font-semibold text-xl mb-2">Shipment Details</h2>

              <div>
                <label className="input-label">Shipment Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['local', 'interstate'].map((type) => (
                    <label key={type} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      shipmentType === type ? 'border-primary-500 bg-primary-500/10' : 'border-white/15 hover:border-white/30'
                    }`}>
                      <input type="radio" value={type} {...register('shipmentType')} className="hidden" />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${shipmentType === type ? 'border-primary-500' : 'border-gray-500'}`}>
                        {shipmentType === type && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium capitalize">{type}</p>
                        <p className="text-gray-500 text-xs">{type === 'local' ? 'Same city delivery' : 'Multi-state delivery'}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Material Name *</label>
                  <input className={`input-field ${errors.materialName ? 'border-red-500' : ''}`} placeholder="e.g., Electronic Components"
                    {...register('materialName', { required: 'Required' })} />
                  {errors.materialName && <p className="text-red-400 text-xs mt-1">{errors.materialName.message}</p>}
                </div>
                <div>
                  <label className="input-label">Weight (kg) *</label>
                  <input type="number" className={`input-field ${errors.materialWeight ? 'border-red-500' : ''}`} placeholder="0.0"
                    {...register('materialWeight', { required: 'Required', min: { value: 0.1, message: 'Min 0.1 kg' } })} />
                  {errors.materialWeight && <p className="text-red-400 text-xs mt-1">{errors.materialWeight.message}</p>}
                </div>
              </div>

              <div>
                <label className="input-label">Quantity *</label>
                <input type="number" className={`input-field ${errors.quantity ? 'border-red-500' : ''}`} placeholder="1"
                  {...register('quantity', { required: 'Required', min: { value: 1, message: 'Min 1' } })} />
                {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity.message}</p>}
              </div>

              {/* Image Upload */}
              <div>
                <label className="input-label">Product Images (Optional, max 5)</label>
                <label id="image-upload-area" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary-500/50 transition-colors">
                  <Upload size={22} className="text-gray-500 mb-2" />
                  <span className="text-gray-500 text-sm">Click to upload images</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                {images.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {images.map((img, i) => (
                      <div key={i} className="relative">
                        <img src={URL.createObjectURL(img)} alt="" className="w-16 h-16 object-cover rounded-lg border border-white/20" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-8 space-y-6">
              <h2 className="text-white font-semibold text-xl">Pickup & Delivery Addresses</h2>
              {/* Pickup */}
              <div>
                <p className="text-primary-400 text-sm font-semibold mb-3 flex items-center gap-2"><MapPin size={14} /> Pickup Address</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { field: 'pickupStreet', label: 'Street Address', placeholder: '123 Main Street', full: true },
                    { field: 'pickupCity', label: 'City', placeholder: 'Chennai' },
                    { field: 'pickupState', label: 'State', placeholder: 'Tamil Nadu' },
                    { field: 'pickupPincode', label: 'Pincode', placeholder: '600001' },
                  ].map(({ field, label, placeholder, full }) => (
                    <div key={field} className={full ? 'md:col-span-2' : ''}>
                      <label className="input-label">{label} *</label>
                      <input className={`input-field ${errors[field] ? 'border-red-500' : ''}`} placeholder={placeholder}
                        {...register(field, { required: `${label} is required` })} />
                      {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field].message}</p>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="divider" />
              {/* Delivery */}
              <div>
                <p className="text-accent-400 text-sm font-semibold mb-3 flex items-center gap-2"><MapPin size={14} /> Delivery Address</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { field: 'deliveryStreet', label: 'Street Address', placeholder: '456 Park Road', full: true },
                    { field: 'deliveryCity', label: 'City', placeholder: 'Mumbai' },
                    { field: 'deliveryState', label: 'State', placeholder: 'Maharashtra' },
                    { field: 'deliveryPincode', label: 'Pincode', placeholder: '400001' },
                  ].map(({ field, label, placeholder, full }) => (
                    <div key={field} className={full ? 'md:col-span-2' : ''}>
                      <label className="input-label">{label} *</label>
                      <input className={`input-field ${errors[field] ? 'border-red-500' : ''}`} placeholder={placeholder}
                        {...register(field, { required: `${label} is required` })} />
                      {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field].message}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-8 space-y-5">
              <h2 className="text-white font-semibold text-xl">Receiver Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Receiver Name *</label>
                  <input className={`input-field ${errors.receiverName ? 'border-red-500' : ''}`} placeholder="John Smith"
                    {...register('receiverName', { required: 'Receiver name is required' })} />
                  {errors.receiverName && <p className="text-red-400 text-xs mt-1">{errors.receiverName.message}</p>}
                </div>
                <div>
                  <label className="input-label">Receiver Phone *</label>
                  <input className={`input-field ${errors.receiverPhone ? 'border-red-500' : ''}`} placeholder="9876543210"
                    {...register('receiverPhone', {
                      required: 'Phone is required',
                      pattern: { value: /^[0-9]{10}$/, message: 'Enter valid 10-digit number' },
                    })} />
                  {errors.receiverPhone && <p className="text-red-400 text-xs mt-1">{errors.receiverPhone.message}</p>}
                </div>
              </div>
              <div>
                <label className="input-label">Special Instructions (Optional)</label>
                <textarea className="input-field resize-none h-24" placeholder="Handle with care, fragile items..."
                  {...register('specialInstructions')} />
              </div>
            </motion.div>
          )}

          {/* Step 4 – Review */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-8 space-y-6">
              <h2 className="text-white font-semibold text-xl">Review & Confirm</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-dark-800/60 rounded-xl p-4 space-y-2">
                  <p className="text-primary-400 text-sm font-semibold">Shipment Details</p>
                  <p className="text-white text-sm">{values.materialName}</p>
                  <p className="text-gray-400 text-sm">{values.materialWeight} kg · {values.quantity} units</p>
                  <span className="badge-primary text-xs">{values.shipmentType}</span>
                </div>
                <div className="bg-dark-800/60 rounded-xl p-4 space-y-2">
                  <p className="text-accent-400 text-sm font-semibold">Receiver</p>
                  <p className="text-white text-sm">{values.receiverName}</p>
                  <p className="text-gray-400 text-sm">{values.receiverPhone}</p>
                </div>
                <div className="bg-dark-800/60 rounded-xl p-4 space-y-1">
                  <p className="text-green-400 text-sm font-semibold">Pickup</p>
                  <p className="text-white text-sm">{values.pickupStreet}</p>
                  <p className="text-gray-400 text-sm">{values.pickupCity}, {values.pickupState} - {values.pickupPincode}</p>
                </div>
                <div className="bg-dark-800/60 rounded-xl p-4 space-y-1">
                  <p className="text-yellow-400 text-sm font-semibold">Delivery</p>
                  <p className="text-white text-sm">{values.deliveryStreet}</p>
                  <p className="text-gray-400 text-sm">{values.deliveryCity}, {values.deliveryState} - {values.deliveryPincode}</p>
                </div>
              </div>
              {/* Pricing estimate */}
              <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4">
                <p className="text-primary-400 text-sm font-semibold mb-2">Estimated Pricing</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Base Price</span>
                    <span>₹{values.shipmentType === 'interstate' ? '500' : '200'}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Weight Charge ({values.materialWeight} kg × ₹10)</span>
                    <span>₹{(values.materialWeight * 10).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-white font-semibold pt-1 border-t border-white/10 mt-2">
                    <span>Total Estimate</span>
                    <span>₹{((values.shipmentType === 'interstate' ? 500 : 200) + values.materialWeight * 10).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            id="shipment-prev"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            className={`btn-secondary ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ArrowLeft size={16} /> Previous
          </button>
          {step < 4 ? (
            <button id="shipment-next" type="button" onClick={nextStep} className="btn-primary">
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button id="shipment-submit" type="submit" disabled={loading} className="btn-primary">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle size={16} /> Confirm Shipment</>}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
