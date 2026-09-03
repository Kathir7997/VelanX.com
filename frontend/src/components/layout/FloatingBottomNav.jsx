import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';

export default function FloatingBottomNav({ links, basePath }) {
  const location = useLocation();

  const isActive = (href) => {
    const fullPath = href ? `${basePath}/${href}` : basePath;
    return location.pathname === fullPath;
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.nav 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="flex items-center px-2 py-2 gap-2 vision-glass rounded-full"
      >
        {/* Left Logo / Home Button */}
        <Link to="/" className="relative flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/5 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-[#1A1D27] flex items-center justify-center">
            <Truck size={18} strokeWidth={2} className="text-white" />
          </div>
          <div className="absolute -top-10 px-3 py-1.5 bg-[#1A1D27] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
            Home
          </div>
        </Link>
        
        {/* Separator */}
        <div className="w-[1px] h-8 bg-white/10 mx-1" />

        {/* Dynamic Links */}
        <div className="flex items-center gap-1">
          {links.map(({ href, icon: Icon, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                to={href ? `${basePath}/${href}` : basePath}
                className="relative flex items-center justify-center w-12 h-12 rounded-[18px] group"
              >
                {active && (
                  <motion.div
                    layoutId="active-nav-bg"
                    className="absolute inset-0 bg-white/15 border border-white/10 rounded-[18px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  />
                )}
                <Icon size={20} strokeWidth={1.5} className={`relative z-10 transition-colors ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`} />
                <div className="absolute -top-10 px-3 py-1.5 bg-[#1A1D27] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10 z-50">
                  {label}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Separator */}
        <div className="w-[1px] h-8 bg-white/10 mx-1" />

        {/* Logout Button */}
        <button 
          onClick={() => {
            window.dispatchEvent(new CustomEvent('trigger-logout'));
          }}
          className="relative flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white group"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <div className="absolute -top-10 px-3 py-1.5 bg-[#1A1D27] text-red-400 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
            Sign Out
          </div>
        </button>
      </motion.nav>
    </div>
  );
}
