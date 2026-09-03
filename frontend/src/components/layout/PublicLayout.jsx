import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';



export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* 
        SpatialBackground has been moved to individual pages like LandingPage
        to ensure page-specific backgrounds.
      */}

      <Navbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
