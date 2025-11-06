'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Save } from 'lucide-react';
import RouteGuard from '../components/RouteGuard';

export default function StudentForm() {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    campus: '',
    gender: '',
    mobile: '',
    email: '',
    ssc: '',
    hsc: '',
    graduation: '',
    graduationCgpa: '',
    mbaSpecialization: '',
    semester: 'Semester 1'
  });

  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert numeric fields
      const numericData = {
        ...formData,
        ssc: parseFloat(formData.ssc) || 0,
        hsc: parseFloat(formData.hsc) || 0,
        graduationCgpa: parseFloat(formData.graduationCgpa) || 0
      };

      await addDoc(collection(db, 'students'), {
        ...numericData,
        timestamp: new Date().toISOString(),
      });

      setSubmitSuccess(true);
      setFormData({
        name: '',
        rollNumber: '',
        campus: '',
        gender: '',
        mobile: '',
        email: '',
        ssc: '',
        hsc: '',
        graduation: '',
        graduationCgpa: '',
        mbaSpecialization: '',
        semester: 'Semester 1'
      });

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 font-poppins text-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Student Information Form</h1>
            <p className="text-gray-400">Fill in your academic details</p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6"
            onSubmit={handleSubmit}
          >
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-gray-300">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300">Roll Number</label>
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300">Campus</label>
                  <input
                    type="text"
                    value={formData.campus}
                    onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300">Mobile</label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Academic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-gray-300">SSC Percentage</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.ssc}
                    onChange={(e) => setFormData({ ...formData, ssc: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300">HSC Percentage</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.hsc}
                    onChange={(e) => setFormData({ ...formData, hsc: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300">Graduation Stream</label>
                  <input
                    type="text"
                    value={formData.graduation}
                    onChange={(e) => setFormData({ ...formData, graduation: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300">Graduation CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.graduationCgpa}
                    onChange={(e) => setFormData({ ...formData, graduationCgpa: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300">MBA Specialization</label>
                  <input
                    type="text"
                    value={formData.mbaSpecialization}
                    onChange={(e) => setFormData({ ...formData, mbaSpecialization: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300">Current Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Information
                  </>
                )}
              </button>
            </div>

            {/* Success Message */}
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-4 py-2 rounded-xl border border-green-500/20"
              >
                Information saved successfully!
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </RouteGuard>
  );
}