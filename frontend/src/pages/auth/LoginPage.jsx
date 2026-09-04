import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Truck, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import SpatialBackground from '../../components/layout/SpatialBackground';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const ROLE_PATHS = {
    customer: '/dashboard/customer',
    driver: '/dashboard/driver',
    warehouse_manager: '/dashboard/warehouse',
    accountant: '/dashboard/accountant',
    general_manager: '/dashboard/manager',
    admin: '/dashboard/admin',
    owner: '/dashboard/owner',
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      const { user, token } = res.data;
      setAuth(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      const dest = from || ROLE_PATHS[user.role] || '/';
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <SpatialBackground role="default" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-glow-primary">
              <Truck size={20} className="text-gray-900" />
            </div>
            <span className="text-2xl font-display font-bold gradient-text">VelanX</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-700">Sign in to your VelanX account</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-800" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@company.com"
                  className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="input-label mb-0">Password</label>
                <Link to="/forgot-password" className="text-primary-400 text-xs hover:text-primary-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-800" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-800 hover:text-gray-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-gray-800 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign up free
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="glass-card p-4 mt-4">
          <p className="text-gray-800 text-xs text-center mb-3 font-medium">Demo Credentials</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            {[
              { role: 'Owner', email: 'owner@velanx.com' },
              { role: 'Admin', email: 'admin@velanx.com' },
              { role: 'Manager', email: 'general_manager@velanx.com' },
              { role: 'Auditor', email: 'accountant@velanx.com' },
              { role: 'Customer', email: 'customer@velanx.com' },
              { role: 'Driver', email: 'driver@velanx.com' },
            ].map(({ role, email }) => (
              <div 
                key={role} 
                className="bg-black/5 rounded-lg p-2 cursor-pointer hover:bg-black/5 transition-colors"
                onClick={() => {
                  setValue('email', email);
                  setValue('password', 'Password@123');
                }}
              >
                <p className="text-primary-400 font-semibold">{role}</p>
                <p className="text-gray-800 truncate">{email}</p>
                <p className="text-gray-600">Pass: Password@123</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
