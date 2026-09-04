import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const plans = [
  { name: 'Starter', price: '₹2,999', period: '/month', desc: 'Perfect for small businesses', color: 'border-white/15', features: ['500 shipments/month', '5 drivers', '2 warehouses', 'Basic analytics', 'Email support'], cta: 'Get Started', popular: false },
  { name: 'Professional', price: '₹7,999', period: '/month', desc: 'For growing companies', color: 'border-primary-500/40', features: ['2,000 shipments/month', '25 drivers', '10 warehouses', 'Advanced analytics', 'Priority support', 'API access'], cta: 'Start Free Trial', popular: true },
  { name: 'Enterprise', price: 'Custom', period: '', desc: 'For large operations', color: 'border-white/15', features: ['Unlimited shipments', 'Unlimited drivers', 'Unlimited warehouses', 'Custom analytics', '24/7 support', 'White-labeling', 'SLA'], cta: 'Contact Sales', popular: false },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="container-max mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl font-display font-black mb-4">Simple, <span className="gradient-text">transparent pricing</span></h1>
          <p className="text-gray-400 text-lg">Start free, scale as you grow. No hidden fees, no surprises.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map(({ name, price, period, desc, color, features, cta, popular }, i) => (
            <motion.div key={name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`glass-card p-8 border ${color} relative ${popular ? 'ring-1 ring-primary-500/30' : ''}`}>
              {popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-500 text-white text-xs font-bold rounded-full">Most Popular</div>}
              <h3 className="text-white font-bold text-xl mb-1">{name}</h3>
              <p className="text-gray-500 text-sm mb-4">{desc}</p>
              <div className="mb-8">
                <span className="text-4xl font-display font-black text-white">{price}</span>
                <span className="text-gray-500 text-sm">{period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle size={13} className="text-green-400 flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Link to="/register" id={`pricing-${name.toLowerCase()}`} className={`${popular ? 'btn-primary' : 'btn-secondary'} w-full justify-center`}>
                {cta} <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
