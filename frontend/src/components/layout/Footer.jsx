import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, MessageSquare, Share2, Globe, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/services' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Track Shipment', href: '/track' },
    { label: 'API Docs', href: '#' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-dark-900/50 mt-auto">
      <div className="container-max mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <Truck size={18} className="text-gray-900" />
              </div>
              <span className="text-xl font-display font-bold gradient-text">VelanX</span>
            </Link>
            <p className="text-gray-700 text-sm leading-relaxed mb-6 max-w-xs">
              Smart Logistics & Material Transportation Management Platform. 
              End-to-end shipment lifecycle management for modern businesses.
            </p>
            <div className="flex flex-col gap-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-primary-400" />
                <span>hello@velanx.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-primary-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-primary-400" />
                <span>Chennai, Tamil Nadu, India</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-gray-900 font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-700 hover:text-gray-900 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-black/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-800 text-sm">
            © {new Date().getFullYear()} VelanX. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[
              { Icon: MessageSquare, href: '#', label: 'Twitter' },
              { Icon: Share2, href: '#', label: 'LinkedIn' },
              { Icon: Globe, href: '#', label: 'GitHub' },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/5 hover:bg-black/10 text-gray-700 hover:text-gray-900 transition-all duration-200"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
