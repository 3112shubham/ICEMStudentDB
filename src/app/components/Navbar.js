// components/Navbar.js
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { GraduationCap, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center px-6">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            {/* Gryphon Logo */}
            <div className="flex items-center gap-2">
              <div className="w-30 h-22 relative">
                <Image
                  src="/gryphon_logo.png"
                  alt="Gryphon Logo"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
{/* 
              <div className="hidden sm:flex flex-col">
                <h1 className="text-2xl font-bold text-white">Student Analytics</h1>
                <p className="text-md text-gray-400">Performance Dashboard</p>
              </div> */}
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/10 text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white/5 border-t border-white/10"
        >
          <div className="px-4 py-4 space-y-4">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-white/10 text-white"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
