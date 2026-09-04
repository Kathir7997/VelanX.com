import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Users, Plus, X, Loader2, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const ROLES = ['customer', 'driver', 'warehouse_manager', 'accountant', 'general_manager']; // Admins and Owners are hidden from standard admin creation

export default function AdminUsers() {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // all, customer, staff, owner
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const r = await api.get('/users?limit=200');
      return r.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (d) => api.post('/users', d),
    onSuccess: () => { queryClient.invalidateQueries(['admin-users']); toast.success('User created!'); setShowForm(false); reset(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => api.put(`/users/${id}/toggle-status`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-users']); toast.success('Status updated!'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-users']); toast.success('User deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  // Filter out admins and owners from the base list so the Admin can't see/edit them
  const allUsers = (data || []).filter(u => u.role !== 'admin' && u.role !== 'owner');
  
  const filteredUsers = allUsers.filter(u => {
    if (activeTab === 'customer') return u.role === 'customer';
    if (activeTab === 'staff') return ['driver', 'warehouse_manager', 'accountant', 'general_manager'].includes(u.role);
    return true; // 'all'
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="page-header mb-0">
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage all platform users and roles</p>
        </div>
        <button id="add-user-btn" onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> Add User</button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-900 font-semibold">Create New User</h3>
            <button onClick={() => { setShowForm(false); reset(); }}><X size={18} className="text-gray-800 hover:text-gray-900" /></button>
          </div>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="grid md:grid-cols-3 gap-4">
            {[
              { field: 'name', label: 'Full Name', placeholder: 'John Doe', type: 'text' },
              { field: 'email', label: 'Email', placeholder: 'john@velanx.com', type: 'email' },
              { field: 'phone', label: 'Phone', placeholder: '9876543210', type: 'tel' },
              { field: 'password', label: 'Password', placeholder: 'Min. 6 chars', type: 'password' },
            ].map(({ field, label, placeholder, type }) => (
              <div key={field}>
                <label className="input-label">{label} *</label>
                <input type={type} className="input-field" placeholder={placeholder} {...register(field, { required: true })} />
              </div>
            ))}
            <div>
              <label className="input-label">Role *</label>
              <select className="input-field" {...register('role', { required: true })}>
                {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={createMutation.isLoading} className="btn-primary w-full justify-center">
                {createMutation.isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6 border-b border-black/10">
        {[
          { id: 'all', label: 'All Users' },
          { id: 'customer', label: 'Customers' },
          { id: 'staff', label: 'Staff' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-primary-500 text-gray-900' 
                : 'border-transparent text-gray-800 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        {isLoading ? <div className="p-12 text-center text-gray-800">Loading...</div> : (
          <table className="data-table">
            <thead><tr><th>User</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-gray-900 text-xs font-bold">{u.name?.charAt(0)}</div>
                      <span className="text-gray-900 font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-gray-700 text-xs">{u.email}</td>
                  <td className="text-gray-700 text-xs">{u.phone}</td>
                  <td><span className="badge-primary text-xs capitalize">{u.role?.replace('_', ' ')}</span></td>
                  <td><span className={u.isActive ? 'badge-success' : 'badge-error'}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="text-xs">{format(new Date(u.createdAt), 'dd MMM yyyy')}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button id={`toggle-user-${u._id}`} onClick={() => toggleMutation.mutate(u._id)} className="p-1.5 rounded-lg hover:bg-black/5 text-gray-700 hover:text-gray-900 transition-all" title={u.isActive ? 'Deactivate' : 'Activate'}>
                        {u.isActive ? <ToggleRight size={16} className="text-green-400" /> : <ToggleLeft size={16} />}
                      </button>
                      <button id={`delete-user-${u._id}`} onClick={() => { if (window.confirm('Delete this user?')) deleteMutation.mutate(u._id); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-700 hover:text-red-400 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
