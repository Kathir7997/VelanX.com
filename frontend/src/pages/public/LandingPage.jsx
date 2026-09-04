import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Truck, Package, MapPin, BarChart3, Shield, Zap,
  Clock, Users, Warehouse, Car, ChevronRight, Star, CheckCircle,
  Globe, TrendingUp, Layers, Navigation, PackageCheck, DollarSign,
  Play, ArrowUpRight, Activity, Bell, Search,
} from 'lucide-react';

// ─── Animated Counter ───────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Section Wrapper ────────────────────────────────────────────
function Section({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── Feature Card ────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="glass-card-hover p-6 group cursor-default"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color} transition-transform duration-300 group-hover:scale-110`}>
        <Icon size={22} className="text-white" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ─── Stats Data ──────────────────────────────────────────────────
const stats = [
  { label: 'Shipments Delivered', value: 150000, suffix: '+', icon: PackageCheck },
  { label: 'Active Drivers', value: 2400, suffix: '+', icon: Users },
  { label: 'Warehouses', value: 48, suffix: '', icon: Warehouse },
  { label: 'Uptime', value: 99, suffix: '.9%', icon: Activity },
];

// ─── Features Data ───────────────────────────────────────────────
const features = [
  { icon: Zap, title: 'Real-time Tracking', description: 'Live GPS tracking with instant status updates at every milestone of the journey.', color: 'bg-gradient-to-br from-yellow-500 to-orange-500', delay: 0 },
  { icon: Shield, title: 'RBAC Security', description: 'Role-based access control ensuring each user sees only what they need.', color: 'bg-gradient-to-br from-primary-500 to-primary-700', delay: 0.1 },
  { icon: Warehouse, title: 'Warehouse Network', description: 'Multi-warehouse support with automated inventory tracking and capacity management.', color: 'bg-gradient-to-br from-accent-500 to-accent-700', delay: 0.2 },
  { icon: BarChart3, title: 'Analytics Suite', description: 'Comprehensive revenue, driver, and operational analytics with visual dashboards.', color: 'bg-gradient-to-br from-green-500 to-emerald-600', delay: 0.3 },
  { icon: Car, title: 'Fleet Management', description: 'Complete vehicle tracking, maintenance scheduling, and driver assignment.', color: 'bg-gradient-to-br from-purple-500 to-violet-600', delay: 0.4 },
  { icon: DollarSign, title: 'Financial Management', description: 'Payroll, expenses, invoicing, and revenue reports all in one place.', color: 'bg-gradient-to-br from-pink-500 to-rose-600', delay: 0.5 },
];

// ─── Shipment Steps ──────────────────────────────────────────────
const localSteps = [
  { label: 'Booking Created', icon: Package, color: 'bg-primary-500' },
  { label: 'Driver Assigned', icon: Users, color: 'bg-blue-500' },
  { label: 'Picked Up', icon: Truck, color: 'bg-yellow-500' },
  { label: 'Out for Delivery', icon: Navigation, color: 'bg-orange-500' },
  { label: 'Delivered', icon: PackageCheck, color: 'bg-green-500' },
  { label: 'Confirmed', icon: CheckCircle, color: 'bg-accent-500' },
];

const interstateSteps = [
  { label: 'Booking', icon: Package, color: 'bg-primary-500' },
  { label: 'Driver Assigned', icon: Users, color: 'bg-blue-500' },
  { label: 'Picked Up', icon: Truck, color: 'bg-yellow-500' },
  { label: 'Origin Warehouse', icon: Warehouse, color: 'bg-purple-500' },
  { label: 'In Transit', icon: Globe, color: 'bg-orange-500' },
  { label: 'Dest. Warehouse', icon: Warehouse, color: 'bg-pink-500' },
  { label: 'Local Delivery', icon: Truck, color: 'bg-accent-500' },
  { label: 'Confirmed', icon: CheckCircle, color: 'bg-green-500' },
];

// ─── Roles ───────────────────────────────────────────────────────
const roles = [
  {
    role: 'Customer',
    description: 'Book shipments, track in real-time, manage history and download invoices.',
    features: ['Create Shipments', 'Live Tracking', 'Invoice Downloads', 'Delivery Confirmation'],
    gradient: 'from-primary-500/20 to-primary-600/5',
    border: 'border-primary-500/30',
    icon: Package,
  },
  {
    role: 'Driver',
    description: 'Accept assignments, upload proofs, manage status and confirm deliveries.',
    features: ['Assignment Management', 'Status Control', 'Proof Upload', 'OTP Verification'],
    gradient: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-500/30',
    icon: Truck,
  },
  {
    role: 'Warehouse Manager',
    description: 'Receive and dispatch shipments, track inventory and manage operations.',
    features: ['Receive Shipments', 'Dispatch Orders', 'Capacity Tracking', 'Inventory Reports'],
    gradient: 'from-purple-500/20 to-purple-600/5',
    border: 'border-purple-500/30',
    icon: Warehouse,
  },
  {
    role: 'Accountant',
    description: 'Manage payroll, track expenses, and generate financial reports.',
    features: ['Payroll Management', 'Expense Tracking', 'Revenue Reports', 'Financial Analytics'],
    gradient: 'from-green-500/20 to-green-600/5',
    border: 'border-green-500/30',
    icon: DollarSign,
  },
  {
    role: 'General Manager',
    description: 'Monitor operations, manage warehouses, track drivers and generate reports.',
    features: ['Operations Monitor', 'Warehouse Network', 'Driver Oversight', 'Custom Reports'],
    gradient: 'from-orange-500/20 to-orange-600/5',
    border: 'border-orange-500/30',
    icon: TrendingUp,
  },
  {
    role: 'Admin / Owner',
    description: 'Full platform control with analytics, user management and system settings.',
    features: ['Full Analytics', 'User Management', 'Vehicle Fleet', 'System Settings'],
    gradient: 'from-accent-500/20 to-accent-600/5',
    border: 'border-accent-500/30',
    icon: BarChart3,
  },
];

// ─── Testimonials ────────────────────────────────────────────────
const testimonials = [
  { name: 'Rajesh Kumar', role: 'Operations Director', company: 'TechCargo India', text: 'VelanX transformed our logistics operations. Real-time tracking and multi-warehouse support cut our delivery time by 40%.', rating: 5 },
  { name: 'Priya Sharma', role: 'Fleet Manager', company: 'SwiftMove Logistics', text: 'The driver management system is exceptional. Our fleet efficiency has improved dramatically since switching to VelanX.', rating: 5 },
  { name: 'Arun Nair', role: 'CFO', company: 'LogiCore Systems', text: 'The financial analytics and payroll management features alone saved us 15 hours per week. Absolutely worth every rupee.', rating: 5 },
];

// ─── Pricing ─────────────────────────────────────────────────────
const pricingPlans = [
  {
    name: 'Starter',
    price: '₹2,999',
    period: '/month',
    description: 'Perfect for small logistics businesses',
    features: ['Up to 500 shipments/month', '5 drivers', '2 warehouses', 'Basic analytics', 'Email support'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    price: '₹7,999',
    period: '/month',
    description: 'For growing logistics companies',
    features: ['Up to 2000 shipments/month', '25 drivers', '10 warehouses', 'Advanced analytics', 'Priority support', 'API access'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large-scale operations',
    features: ['Unlimited shipments', 'Unlimited drivers', 'Unlimited warehouses', 'Custom analytics', '24/7 dedicated support', 'White-labeling', 'SLA guarantee'],
    cta: 'Contact Sales',
    popular: false,
  },
];

// ─── Dashboard Preview ───────────────────────────────────────────
function DashboardPreview() {
  return (
    <div className="relative glass-card p-1 overflow-hidden">
      {/* Window chrome */}
      <div className="bg-dark-800/80 rounded-xl p-3 flex items-center gap-2 mb-0.5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 bg-dark-900/60 rounded-md px-3 py-1 text-gray-500 text-xs flex items-center gap-2">
          <Search size={10} /> app.velanx.com/dashboard
        </div>
      </div>

      {/* Dashboard UI Mock */}
      <div className="bg-dark-900/90 rounded-xl p-4 grid grid-cols-4 gap-3 min-h-[300px]">
        {/* Sidebar */}
        <div className="col-span-1 bg-dark-800/60 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-md" />
            <div className="h-3 w-16 bg-primary-500/40 rounded" />
          </div>
          {['Dashboard', 'Shipments', 'Drivers', 'Analytics', 'Settings'].map((item, i) => (
            <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${i === 0 ? 'bg-primary-500/20 text-primary-400' : 'text-gray-500'}`}>
              <div className="w-3 h-3 bg-current rounded-sm opacity-60" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="col-span-3 space-y-3">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Revenue', val: '₹4.2L', color: 'text-green-400' },
              { label: 'Shipments', val: '1,247', color: 'text-primary-400' },
              { label: 'Drivers', val: '48', color: 'text-accent-400' },
              { label: 'Vehicles', val: '32', color: 'text-yellow-400' },
            ].map(({ label, val, color }) => (
              <div key={label} className="bg-dark-800/60 rounded-xl p-3">
                <p className="text-gray-500 text-xs">{label}</p>
                <p className={`font-bold text-sm mt-0.5 ${color}`}>{val}</p>
              </div>
            ))}
          </div>

          {/* Chart Mock */}
          <div className="bg-dark-800/60 rounded-xl p-3">
            <p className="text-gray-400 text-xs mb-2">Revenue Overview</p>
            <div className="flex items-end gap-1 h-16">
              {[40, 60, 45, 80, 65, 90, 75, 95, 70, 85, 55, 100].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-primary-600/80 to-primary-400/40" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-dark-800/60 rounded-xl p-3">
            <p className="text-gray-400 text-xs mb-2">Recent Shipments</p>
            <div className="space-y-1.5">
              {[
                { id: 'VLX-ABC123', status: 'Delivered', color: 'text-green-400' },
                { id: 'VLX-DEF456', status: 'In Transit', color: 'text-yellow-400' },
                { id: 'VLX-GHI789', status: 'Pending', color: 'text-primary-400' },
              ].map(({ id, status, color }) => (
                <div key={id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-mono">{id}</span>
                  <span className={`${color} font-medium`}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────
export default function LandingPage() {
  const [activeWorkflow, setActiveWorkflow] = useState('local');
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden relative">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 px-6">
        {/* Removed opaque grid-bg and glow orbs to let SpatialBackground shine through */}

        <div className="container-max mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-sm font-medium mb-8"
              >
                <Zap size={14} className="fill-current" />
                Smart Logistics Platform — Built for Scale
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl lg:text-7xl font-display font-black leading-[1.05] mb-6 text-balance"
              >
                Ship Smarter.{' '}
                <span className="gradient-text">Move Faster.</span>{' '}
                Deliver Better.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-white text-lg leading-relaxed mb-10 max-w-lg"
              >
                VelanX is the complete logistics management platform — from booking to delivery, 
                with real-time tracking, multi-warehouse support, and deep analytics for every role.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-12"
              >
                <Link to="/register" id="hero-cta-primary" className="btn-primary btn-lg">
                  Start for Free <ArrowRight size={18} />
                </Link>
                <Link to="/track" id="hero-cta-track" className="btn-secondary btn-lg">
                  <MapPin size={18} /> Track Shipment
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-6 text-sm text-white"
              >
                {['No credit card required', 'Free 14-day trial', 'Cancel anytime'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-green-400" />
                    {item}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right – Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="animate-float">
                <DashboardPreview />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <Section className="section-padding border-y border-white/10 glass-card mx-6 my-12 rounded-[2.5rem]">
        <div className="container-max mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ label, value, suffix, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center border border-primary-500/20">
                  <Icon size={22} className="text-primary-400" />
                </div>
                <div className="text-4xl font-display font-black gradient-text">
                  <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <p className="text-gray-400 text-sm">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <Section className="section-padding">
        <div className="container-max mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-4">Platform Features</p>
            <h2 className="text-4xl lg:text-5xl font-display font-black mb-4">
              Everything you need to{' '}
              <span className="gradient-text">run logistics</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From shipment creation to final delivery confirmation, VelanX covers every step with enterprise-grade features.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </Section>

      {/* ── SHIPMENT WORKFLOW ─────────────────────────────────────── */}
      <Section className="section-padding">
        <div className="container-max mx-auto glass-card p-12 lg:p-20 rounded-[3rem]">
          <div className="text-center mb-12">
            <p className="text-accent-400 text-sm font-semibold uppercase tracking-widest mb-4">Shipment Workflow</p>
            <h2 className="text-4xl lg:text-5xl font-display font-black mb-4">
              Track every step of the{' '}
              <span className="gradient-text">journey</span>
            </h2>
            {/* Toggle */}
            <div className="inline-flex gap-1 p-1 bg-dark-800/60 rounded-xl border border-white/10 mt-6">
              {['local', 'interstate'].map((type) => (
                <button
                  key={type}
                  id={`workflow-${type}`}
                  onClick={() => setActiveWorkflow(type)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeWorkflow === type
                      ? 'bg-primary-500 text-white shadow-glow-primary'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {type === 'local' ? '🏙 Local Delivery' : '🛣 Interstate Delivery'}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeWorkflow}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap justify-center gap-4 items-center"
            >
              {(activeWorkflow === 'local' ? localSteps : interstateSteps).map((step, i, arr) => (
                <React.Fragment key={step.label}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className={`w-12 h-12 ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <step.icon size={20} className="text-white" />
                    </div>
                    <span className="text-xs text-gray-400 text-center max-w-[80px]">{step.label}</span>
                  </motion.div>
                  {i < arr.length - 1 && (
                    <ChevronRight size={16} className="text-gray-600 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </Section>

      {/* ── ROLE SHOWCASE ─────────────────────────────────────────── */}
      <Section className="section-padding">
        <div className="container-max mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-4">For Every Role</p>
            <h2 className="text-4xl lg:text-5xl font-display font-black mb-4">
              Built for <span className="gradient-text">every team member</span>
            </h2>
            <p className="text-white max-w-2xl mx-auto">
              Every role gets a dedicated, purpose-built interface with exactly the tools they need.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role, i) => (
              <motion.div
                key={role.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`glass-card p-6 border ${role.border} bg-gradient-to-br ${role.gradient} hover:-translate-y-1 transition-transform duration-300`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <role.icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg">{role.role}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{role.description}</p>
                <ul className="space-y-2">
                  {role.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle size={13} className="text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── ANALYTICS PREVIEW ─────────────────────────────────────── */}
      <Section className="section-padding">
        <div className="container-max mx-auto glass-card p-12 rounded-[3rem]">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent-400 text-sm font-semibold uppercase tracking-widest mb-4">Analytics & Insights</p>
              <h2 className="text-4xl font-display font-black mb-6">
                Data-driven decisions for{' '}
                <span className="gradient-text">smarter operations</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Get comprehensive visibility into every aspect of your logistics operations — 
                revenue trends, driver performance, shipment analytics, and warehouse efficiency.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'Revenue Tracking', icon: TrendingUp },
                  { label: 'Driver Analytics', icon: Users },
                  { label: 'Fleet Reports', icon: Car },
                  { label: 'Warehouse KPIs', icon: Warehouse },
                ].map(({ label, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center border border-primary-500/20">
                      <Icon size={14} className="text-primary-400" />
                    </div>
                    {label}
                  </div>
                ))}
              </div>
              <Link to="/register" className="btn-primary">
                Explore Analytics <ArrowUpRight size={16} />
              </Link>
            </div>
            {/* Chart Mock */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white font-semibold">Monthly Revenue</p>
                  <p className="text-gray-400 text-sm">2026</p>
                </div>
                <div className="text-2xl font-bold text-green-400">₹48.2L</div>
              </div>
              <div className="flex items-end gap-2 h-40">
                {[55, 70, 60, 85, 75, 95, 80, 100, 88, 72, 90, 98].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-500"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-gray-600 text-xs">
                      {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10 text-sm">
                <span className="text-gray-400">vs last year</span>
                <span className="text-green-400 font-semibold flex items-center gap-1">
                  <TrendingUp size={14} /> +32.4%
                </span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <Section className="section-padding">
        <div className="container-max mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-4">Testimonials</p>
            <h2 className="text-4xl font-display font-black">
              Trusted by logistics leaders <span className="gradient-text">across India</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card-hover p-6 ${activeTestimonial === i ? 'border-primary-500/40' : ''}`}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div>
                  <p className="text-white font-semibold">{t.name}</p>
                  <p className="text-gray-500 text-sm">{t.role} · {t.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── PRICING ──────────────────────────────────────────────── */}
      <Section className="section-padding" id="pricing">
        <div className="container-max mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-4">Pricing</p>
            <h2 className="text-4xl lg:text-5xl font-display font-black mb-4">
              Simple, <span className="gradient-text">transparent pricing</span>
            </h2>
            <p className="text-white">Start free, scale as you grow. No hidden fees.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-8 relative ${plan.popular ? 'border-primary-500/50 ring-1 ring-primary-500/30' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-500 text-white text-xs font-bold rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>
                <div className="mb-8">
                  <span className="text-4xl font-display font-black text-white">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  id={`pricing-${plan.name.toLowerCase()}`}
                  className={plan.popular ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CTA BANNER ───────────────────────────────────────────── */}
      <Section className="section-padding">
        <div className="container-max mx-auto">
          <div className="relative glass-card p-12 lg:p-20 text-center rounded-[3rem] overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-display font-black mb-6">
                Ready to transform your{' '}
                <span className="gradient-text">logistics?</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of businesses that trust VelanX for their complete logistics management.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/register" id="cta-final-primary" className="btn-primary btn-lg">
                  Start Free Trial <ArrowRight size={18} />
                </Link>
                <Link to="/contact" id="cta-final-contact" className="btn-secondary btn-lg">
                  Talk to Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
