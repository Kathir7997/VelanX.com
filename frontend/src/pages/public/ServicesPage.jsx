import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, Warehouse, Globe, MapPin, Clock, Shield, BarChart3 } from 'lucide-react';

const services = [
  { icon: Truck, title: 'Local Delivery', desc: 'Same-city shipments with fast turnaround and real-time driver tracking.', color: 'bg-primary-500/10 border-primary-500/20 text-primary-400' },
  { icon: Globe, title: 'Interstate Shipping', desc: 'Multi-state logistics with warehouse hubs, ensuring safe long-distance transport.', color: 'bg-accent-500/10 border-accent-500/20 text-accent-400' },
  { icon: Warehouse, title: 'Warehouse Management', desc: 'Network of strategically located warehouses with live capacity tracking.', color: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
  { icon: Package, title: 'Material Handling', desc: 'Specialized handling for fragile, heavy, and industrial materials.', color: 'bg-green-500/10 border-green-500/20 text-green-400' },
  { icon: Clock, title: 'Express Delivery', desc: 'Priority shipments with expedited pickup and guaranteed delivery windows.', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' },
  { icon: BarChart3, title: 'Analytics & Reporting', desc: 'Comprehensive business intelligence for data-driven logistics decisions.', color: 'bg-pink-500/10 border-pink-500/20 text-pink-400' },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="container-max mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl font-display font-black mb-4">Our <span className="gradient-text">Services</span></h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">End-to-end logistics solutions designed for modern businesses</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass-card-hover p-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${color}`}>
                <Icon size={22} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
