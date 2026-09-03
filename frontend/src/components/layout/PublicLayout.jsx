import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

import SpatialBackground from './SpatialBackground';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* 
        We use the 'default' role background (bright corporate office) 
        as the immersive background for the landing and public pages 
      */}
      <SpatialBackground role="default" />
      
      <Navbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
