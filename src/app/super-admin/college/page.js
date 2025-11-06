'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Building2, Save } from 'lucide-react';
import RouteGuard from '../../components/RouteGuard';
import Navbar from '../../components/Navbar';

export default function CollegeForm() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    logoUrl: '',
    websiteUrl: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'colleges'), {
        ...formData,
        timestamp: new Date().toISOString(),
      });

      setFormData({
        name: '',
        address: '',
        logoUrl: '',
        websiteUrl: ''
      });

      alert('College added successfully!');
    } catch (error) {
      console.error('Error adding college:', error);
      alert('Error adding college. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RouteGuard superAdminOnly>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 font-poppins text-white p-4">
        {/* Navbar */}
        <Navbar />
        
        <div className="max-w-3xl mx-auto mt-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Building2 className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold">Add New College</h1>
              <p className="text-gray-400">Enter college details below</p>
            </div>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <label className="text-gray-300">College Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
                placeholder="Enter college name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-300">College Logo URL</label>
              <input
                type="url"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
                placeholder="Enter logo URL"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-300">College Website URL</label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
                placeholder="Enter website URL"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-300">College Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[100px]"
                required
                placeholder="Enter college address"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-white font-medium transition-colors disabled:opacity-50 mt-6 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Adding College...' : 'Save College'}
            </button>
          </motion.form>
        </div>
      </div>
    </RouteGuard>
  );
}