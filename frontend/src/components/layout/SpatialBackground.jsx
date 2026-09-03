import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';

const BRIGHT_BACKGROUNDS = {
  admin: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
  owner: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', // Unique bright corporate skyscraper
  general_manager: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
  warehouse_manager: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop',
  driver: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop',
  customer: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=2126&auto=format&fit=crop',
  accountant: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
  landing: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2075&auto=format&fit=crop'
};

const DARK_BACKGROUNDS = {
  admin: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop',
  owner: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop', // Unique dark cinematic boardroom
  general_manager: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop',
  warehouse_manager: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c1562b?q=80&w=2070&auto=format&fit=crop',
  driver: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2076&auto=format&fit=crop',
  customer: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop',
  accountant: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop',
  landing: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2076&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop'
};

export default function SpatialBackground({ role }) {
  const { theme } = useThemeStore();
  const BACKGROUNDS = theme === 'bright' ? BRIGHT_BACKGROUNDS : DARK_BACKGROUNDS;
  
  const [currentBg, setCurrentBg] = useState(BACKGROUNDS.default);

  useEffect(() => {
    if (role && BACKGROUNDS[role]) {
      setCurrentBg(BACKGROUNDS[role]);
    } else {
      setCurrentBg(BACKGROUNDS.default);
    }
  }, [role, theme, BACKGROUNDS]);

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden pointer-events-none bg-dark-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBg}
          initial={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${currentBg})` }}
        />
      </AnimatePresence>
      <div className={`absolute inset-0 ${theme === 'bright' ? 'bg-[#0B0F19]/60' : 'vision-bg-overlay'}`} />
    </div>
  );
}
