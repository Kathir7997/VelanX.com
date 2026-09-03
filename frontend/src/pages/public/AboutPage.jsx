import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Users, Globe, Award, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="container-max mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl font-display font-black mb-4">About <span className="gradient-text">VelanX</span></h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Redefining logistics management with intelligent technology and enterprise-grade reliability.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-4xl font-display font-bold mb-6">Built for the <span className="gradient-text">future of logistics</span></h2>
            <p className="text-gray-400 leading-relaxed mb-4">VelanX was founded with a simple mission: make logistics management as seamless and transparent as possible for every stakeholder — from the customer placing a shipment to the driver delivering it.</p>
            <p className="text-gray-400 leading-relaxed">We built a platform that handles the complete shipment lifecycle, with role-specific dashboards, real-time tracking, and powerful analytics that give business owners the insights they need to grow.</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Globe, title: 'Pan-India Network', desc: 'Connecting businesses across all major cities' },
              { icon: Users, title: 'Multi-Role Platform', desc: '6 specialized dashboards for every team member' },
              { icon: Award, title: 'Enterprise Grade', desc: 'Built to scale with your business growth' },
              { icon: Target, title: 'Mission Driven', desc: 'Committed to on-time, safe deliveries' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.3 }} className="glass-card p-4">
                <Icon size={22} className="text-primary-400 mb-2" />
                <h4 className="text-white font-semibold text-sm">{title}</h4>
                <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Team */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold mb-2">Built with <Heart size={20} className="inline text-red-400" /></h2>
          <p className="text-gray-400">VelanX is built by a passionate team of engineers dedicated to logistics innovation.</p>
        </div>
      </div>
    </div>
  );
}
