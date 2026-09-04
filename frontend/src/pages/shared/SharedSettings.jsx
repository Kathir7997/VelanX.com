import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Moon, Sun, Save } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import toast from 'react-hot-toast';

export default function SharedSettings() {
  const { user, updateUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would call your update profile API here.
      if (updateUser) {
         updateUser({ name: formData.name, email: formData.email, phone: formData.phone });
      }
      toast.success('Profile updated successfully');
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="page-header mb-8">
        <h1 className="page-title text-4xl font-display font-bold text-gray-900 mb-2">Settings & Profile</h1>
        <p className="page-subtitle text-gray-700">Manage your account preferences and spatial theme.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Theme & Preferences */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
              {theme === 'dark' ? <Moon size={18} className="text-accent-400" /> : <Sun size={18} className="text-yellow-400" />}
              Spatial Theme
            </h3>
            <p className="text-gray-700 text-sm mb-6">
              Toggle between the bright daylight experience and the dark cinematic experience.
            </p>
            
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                theme === 'dark' 
                  ? 'bg-accent-500/10 border-accent-500/30 text-gray-900' 
                  : 'bg-yellow-500/10 border-yellow-500/30 text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon size={20} className="text-accent-400" /> : <Sun size={20} className="text-yellow-400" />}
                <span className="font-medium">{theme === 'dark' ? 'Dark Mode' : 'Bright Mode'}</span>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-accent-500' : 'bg-yellow-500'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all ${theme === 'dark' ? 'left-1' : 'left-7'}`} />
              </div>
            </button>
          </div>
          
          <div className="glass-card p-6">
             <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-gray-900 text-3xl font-bold shadow-lg">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-gray-900 font-bold text-lg">{user?.name}</p>
                <p className="text-gray-700 text-sm capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSaveProfile} className="glass-card p-8">
            <h3 className="text-gray-900 font-semibold mb-6 flex items-center gap-2 text-xl">
              <User size={20} className="text-primary-400" />
              Edit Profile
            </h3>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-3 text-gray-700" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#1A1D27]/50 border border-black/10 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3 text-gray-700" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#1A1D27]/50 border border-black/10 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-3 text-gray-700" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#1A1D27]/50 border border-black/10 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="border-t border-black/10 pt-6 mt-6">
                <h4 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
                  <Lock size={18} className="text-gray-700" />
                  Change Password
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full bg-[#1A1D27]/50 border border-black/10 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full bg-[#1A1D27]/50 border border-black/10 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary px-8 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-primary-500/20"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
