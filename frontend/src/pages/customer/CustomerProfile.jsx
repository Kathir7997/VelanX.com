import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Edit2, Save, X, Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';

export default function CustomerProfile() {
  const [editing, setEditing] = useState(false);
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({ defaultValues: { name: user?.name, phone: user?.phone } });

  const mutation = useMutation({
    mutationFn: (data) => api.put('/auth/profile', data),
    onSuccess: (res) => {
      updateUser(res.data.data);
      queryClient.invalidateQueries(['me']);
      toast.success('Profile updated!');
      setEditing(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account information</p>
      </div>

      <div className="glass-card p-8">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-4xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button id="change-avatar" className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center border-2 border-dark-900 hover:bg-primary-600 transition-colors">
              <Camera size={14} className="text-white" />
            </button>
          </div>
          <h2 className="text-white text-xl font-bold mt-4">{user?.name}</h2>
          <span className="badge-primary mt-1">{user?.role?.replace('_', ' ')}</span>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="input-label">Full Name</label>
              <input className="input-field" {...register('name', { required: true })} />
            </div>
            <div>
              <label className="input-label">Phone</label>
              <input className="input-field" {...register('phone', { required: true })} />
            </div>
            <div className="flex gap-3">
              <button id="save-profile" type="submit" disabled={mutation.isLoading} className="btn-primary">
                {mutation.isLoading ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save</>}
              </button>
              <button type="button" onClick={() => { setEditing(false); reset(); }} className="btn-secondary">
                <X size={16} /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            {[
              { icon: User, label: 'Full Name', value: user?.name },
              { icon: Mail, label: 'Email Address', value: user?.email },
              { icon: Phone, label: 'Phone Number', value: user?.phone },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center border border-primary-500/20">
                  <Icon size={16} className="text-primary-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">{label}</p>
                  <p className="text-white font-medium">{value}</p>
                </div>
              </div>
            ))}
            <button id="edit-profile" onClick={() => setEditing(true)} className="btn-secondary w-full justify-center">
              <Edit2 size={16} /> Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
