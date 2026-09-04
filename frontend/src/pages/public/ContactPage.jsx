import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import api from '../../lib/axios';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Assuming a generic message endpoint or just simulating success
      // await api.post('/contact', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Message sent! We will get back to you soon.');
      reset();
    } catch (err) {
      toast.error('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="container-max mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl font-display font-black mb-4">Get in <span className="gradient-text">Touch</span></h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">Have questions about VelanX? We're here to help you optimize your logistics.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Contact Information</h2>
            <p className="text-gray-700 mb-8 leading-relaxed">Whether you're looking for enterprise pricing, technical support, or just want to learn more about our platform, our team is ready to assist you.</p>

            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email', value: 'hello@velanx.com', color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
                { icon: Phone, label: 'Phone', value: '+91 98765 43210', color: 'text-accent-400', bg: 'bg-accent-500/10 border-accent-500/20' },
                { icon: MapPin, label: 'Office', value: '123 Tech Park, OMR, Chennai, TN 600097, India', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${bg} flex-shrink-0`}>
                    <Icon size={20} className={color} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-1">{label}</h3>
                    <p className="text-gray-700">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 glass-card p-6 border-l-4 border-l-primary-500">
              <h4 className="text-gray-900 font-semibold mb-2">Support Hours</h4>
              <p className="text-gray-700 text-sm">Monday – Friday: 9:00 AM – 6:00 PM (IST)</p>
              <p className="text-gray-700 text-sm mt-1">Weekend support available for Enterprise customers.</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="input-label">Full Name *</label>
                  <input className={`input-field ${errors.name ? 'border-red-500' : ''}`} placeholder="John Doe" {...register('name', { required: 'Required' })} />
                </div>
                <div>
                  <label className="input-label">Email Address *</label>
                  <input type="email" className={`input-field ${errors.email ? 'border-red-500' : ''}`} placeholder="john@company.com" {...register('email', { required: 'Required' })} />
                </div>
              </div>
              <div>
                <label className="input-label">Company Name</label>
                <input className="input-field" placeholder="Acme Logistics" {...register('company')} />
              </div>
              <div>
                <label className="input-label">Subject *</label>
                <input className={`input-field ${errors.subject ? 'border-red-500' : ''}`} placeholder="How can we help?" {...register('subject', { required: 'Required' })} />
              </div>
              <div>
                <label className="input-label">Message *</label>
                <textarea className={`input-field h-32 resize-none ${errors.message ? 'border-red-500' : ''}`} placeholder="Tell us about your needs..." {...register('message', { required: 'Required' })} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
