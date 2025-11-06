// components/sections/StudentJourney.jsr
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  User, Mail, Phone, MapPin, VenusAndMars, BookOpen, 
  Brain, Award, TrendingUp, BarChart3, GraduationCap,
  Target, Clock, Star, Zap, Rocket, ExternalLink,
  Shield, AlertTriangle, TargetIcon, Lightbulb,
  Heart, Activity, Users, Book, Edit2, X
} from 'lucide-react';

const FormInput = ({ label, value, onChange, type = 'text', ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
      {...props}
    />
  </div>
);

const FormTextarea = ({ label, value, onChange, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white min-h-[100px]"
      {...props}
    />
  </div>
);

const ModalForm = ({ children, title, onClose, onSubmit, loading }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50"
  >
    {/* Backdrop */}
    <div 
      className="absolute inset-0 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    />
    
    {/* Modal Content */}
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="relative min-h-screen flex items-center justify-center p-4"
    >
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/10 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl shadow-black/50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          {children}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-white font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </motion.div>
  </motion.div>
);

const EditButtonComponent = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
  >
    <Edit2 className="w-4 h-4 text-gray-400" />
  </button>
); 

export default function StudentJourney({ student }) {
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
                    
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get user's role from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUserRole(userData.role);
          // Check if the current user is viewing their own profile
          setIsCurrentUser(user.email === student?.email);
        }
      } else {
        setCurrentUserRole(null);
        setIsCurrentUser(false);
      }
    });

    return () => unsubscribe();
  }, [student?.email]);

  // Initialize form data when modal opens
  const openModal = (type) => {
    let initialData = {};
    switch(type) {
      case 'college':
        initialData = {
          collegeName: student.collegeName || '',
          collegeAddress: student.collegeAddress || '',
          collegeWebsite: student.collegeWebsite || '',
          campus: student.campus || '',
          batch: student.batch || ''
        };
        break;
      case 'profile':
        initialData = {
          name: student.name || '',
          email: student.email || '',
          mobile: student.mobile || '',
          gender: student.gender || '',
          rollNumber: student.rollNumber || ''
        };
        break;
      case 'education':
        initialData = {
          ssc: student.ssc || '',
          hsc: student.hsc || '',
          graduationCgpa: student.graduationCgpa || '',
          mbaSpecialization: student.mbaSpecialization || ''
        };
        break;
      case 'swot':
        initialData = {
          strengths: student.strengths || '',
          weaknesses: student.weaknesses || '',
          opportunities: student.opportunities || '',
          threats: student.threats || ''
        };
        break;
      case 'personality':
        initialData = {
          mbtiCode: student.mbtiCode || '',
          mbtiDescription: student.mbtiDescription || '',
          hobbies: student.hobbies ? student.hobbies.join(', ') : ''
        };
        break;
    }
    setFormData(initialData);
    setActiveModal(type);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, 'students', student.id), formData);
      setActiveModal(null);
      alert('Updated successfully!');
    } catch (error) {
      console.error('Error updating:', error);
      alert('Error updating. Please try again.');
    }
    setLoading(false);
  };

  // Modal component
  const Modal = ({ children, title }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-3xl border border-white/10 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={() => setActiveModal(null)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {children}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-white font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );

  const EditButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
    >
      <Edit2 className="w-4 h-4 text-gray-400" />
    </button>
  );

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'from-emerald-400 to-green-500';
    if (percentage >= 60) return 'from-blue-400 to-cyan-500';
    if (percentage >= 40) return 'from-amber-400 to-orange-500';
    return 'from-rose-400 to-red-500';
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 80) return 'text-emerald-400';
    if (percentage >= 60) return 'text-cyan-400';
    if (percentage >= 40) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getGlowColor = (percentage) => {
    if (percentage >= 80) return 'shadow-lg shadow-emerald-500/20';
    if (percentage >= 60) return 'shadow-lg shadow-cyan-500/20';
    if (percentage >= 40) return 'shadow-lg shadow-amber-500/20';
    return 'shadow-lg shadow-rose-500/20';
  };

  // Calculate overall scores with proper error handling
  const irpOverall = student?.irpOverall || ((student?.aptitudeOverall + student?.bizCommunication + student?.genAI) / 3) || 0;
  const cldpOverall = student?.cldpOverall || ((student?.bizCommunication + student?.genAI + student?.linkedinBranding + student?.resumecldp) / 4) || 0;
  const academicOverall = student?.overallAcademics || ((student?.internalAcademics + student?.externalAcademics) / 2) || 0;
  const attendanceOverall = student?.attendanceOverall || ((student?.academicsAttendance + student?.irpPhase1Attendance + student?.irpPhase2Attendance + student?.cldpAttendance) / 4) || 0;
  
  const grandOverall = (irpOverall + cldpOverall + academicOverall + attendanceOverall) / 4;

  // Determine areas of excellence
  const getAreasOfExcellence = () => {
    const areas = [];
    if ((student?.aptitudeOverall || 0) >= 80) areas.push('Aptitude');
    if ((student?.bizCommunication || 0) >= 80) areas.push('Communication');
    if ((student?.genAI || 0) >= 80) areas.push('Tools & GenAI');
    return areas.length > 0 ? areas : ['Consistent Across All Areas'];
  };

  if (!student) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400 text-lg">No student data available</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "backOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Left Column - Profile & Education */}
          <div className="xl:col-span-2 space-y-8">
            {/* College Card */}
            <motion.div
              variants={cardVariants}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative"
            >
              {(currentUserRole === 'user' && isCurrentUser) && (
                <EditButtonComponent 
                  onClick={() => {
                    setFormData({
                      collegeName: student.collegeName || '',
                      collegeAddress: student.collegeAddress || '',
                      collegeWebsite: student.collegeWebsite || '',
                      campus: student.campus || '',
                      batch: student.batch || ''
                    });
                    setActiveModal('college');
                  }}
                />
              )}
              <div className="flex items-start gap-4">
              
              {/* College Edit Modal */}
              {activeModal === 'college' && (
                <ModalForm 
                  title="Edit College Details"
                  onClose={() => setActiveModal(null)}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                      await updateDoc(doc(db, 'students', student.id), formData);
                      setActiveModal(null);
                      alert('Updated successfully!');
                    } catch (error) {
                      console.error('Error updating:', error);
                      alert('Error updating. Please try again.');
                    }
                    setLoading(false);
                  }}
                  loading={loading}
                >
                  <div className="space-y-4">
                    <FormInput
                      label="College Name"
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    />
                    <FormInput
                      label="College Address"
                      value={formData.collegeAddress}
                      onChange={(e) => setFormData({ ...formData, collegeAddress: e.target.value })}
                    />
                    <FormInput
                      label="Website"
                      type="url"
                      value={formData.collegeWebsite}
                      onChange={(e) => setFormData({ ...formData, collegeWebsite: e.target.value })}
                    />
                    <FormInput
                      label="Campus"
                      value={formData.campus}
                      onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                    />
                    <FormInput
                      label="Batch"
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    />
                  </div>
                </ModalForm>
              )}
                {/* College Logo */}
                <div className="w-30 h-30 rounded-full bg-white items-center justify-center flex">
                  <div className="w-22 h-22 rounded-full relative">
                    <Image
                      src="/college_logo1.png"
                      alt="Gryphon Logo"
                      fill
                      className="object-contain rounded-lg "
                    />
                  </div>
                </div>
                {/* College Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-bold text-white truncate">
                        {student.collegeName || 'ICEM'}
                      </h2>
                      <p className="text-gray-400 text-sm mt-1">
                        {student.collegeAddress || 'Pune'}
                      </p>
                    </div>
                    <a 
                      href={student.collegeWebsite || '#'}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm"
                    >
                      Visit
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="text-center p-2 rounded-xl bg-white/5">
                      <p className="text-xs text-gray-400">Campus</p>
                      <p className="text-sm font-semibold text-white truncate">{student.campus || 'NA'}</p>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-white/5">
                      <p className="text-xs text-gray-400">Program</p>
                      <p className="text-sm font-semibold text-white truncate">MBA</p>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-white/5">
                      <p className="text-xs text-gray-400">Batch</p>
                      <p className="text-sm font-semibold text-white truncate">{student.batch || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Combined Profile & Education Card */}
            <motion.div
              variants={cardVariants}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative"
            >
              {(currentUserRole === 'user' && isCurrentUser) && (
                <EditButtonComponent 
                  onClick={() => {
                    setFormData({
                      name: student.name || '',
                      email: student.email || '',
                      mobile: student.mobile || '',
                      gender: student.gender || '',
                      rollNumber: student.rollNumber || ''
                    });
                    setActiveModal('profile');
                  }}
                />
              )}

              {activeModal === 'profile' && (
                <ModalForm
                  title="Edit Student Profile"
                  onClose={() => setActiveModal(null)}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                      await updateDoc(doc(db, 'students', student.id), formData);
                      setActiveModal(null);
                      alert('Updated successfully!');
                    } catch (error) {
                      console.error('Error updating:', error);
                      alert('Error updating. Please try again.');
                    }
                    setLoading(false);
                  }}
                  loading={loading}
                >
                  <div className="space-y-4">
                    <FormInput
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <FormInput
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <FormInput
                      label="Mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    />
                    <FormInput
                      label="Gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    />
                    <FormInput
                      label="Roll Number"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    />
                  </div>
                </ModalForm>
              )}

              {/* Profile Section */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">Student Profile</h2>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <User className="w-4 h-4 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Name</p>
                    <p className="font-semibold text-white text-sm">{student.name || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="font-semibold text-white text-sm truncate">{student.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                    <MapPin className="w-3 h-3 text-green-400" />
                    <div>
                      <p className="text-xs text-gray-400">Campus</p>
                      <p className="font-medium text-white text-xs">{student.campus || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                    <VenusAndMars className="w-3 h-3 text-pink-400" />
                    <div>
                      <p className="text-xs text-gray-400">Gender</p>
                      <p className="font-medium text-white text-xs">{student.gender || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                    <Phone className="w-3 h-3 text-purple-400" />
                    <div>
                      <p className="text-xs text-gray-400">Mobile</p>
                      <p className="font-medium text-white text-xs">{student.mobile || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                    <Award className="w-3 h-3 text-cyan-400" />
                    <div>
                      <p className="text-xs text-gray-400">Roll No</p>
                      <p className="font-medium text-white text-xs">{student.rollNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              
            </motion.div>
            <motion.div
              variants={cardVariants}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative"
            >
              {(currentUserRole === 'user' && isCurrentUser) && (
                <EditButtonComponent 
                  onClick={() => {
                    setFormData({
                      ssc: student.ssc || '',
                      hsc: student.hsc || '',
                      graduationCgpa: student.graduationCgpa || '',
                      mbaSpecialization: student.mbaSpecialization || ''
                    });
                    setActiveModal('education');
                  }}
                />
              )}

              {activeModal === 'education' && (
                <ModalForm
                  title="Edit Education Details"
                  onClose={() => setActiveModal(null)}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                      await updateDoc(doc(db, 'students', student.id), formData);
                      setActiveModal(null);
                      alert('Updated successfully!');
                    } catch (error) {
                      console.error('Error updating:', error);
                      alert('Error updating. Please try again.');
                    }
                    setLoading(false);
                  }}
                  loading={loading}
                >
                  <div className="space-y-4">
                    <FormInput
                      label="SSC Score (%)"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.ssc}
                      onChange={(e) => setFormData({ ...formData, ssc: e.target.value })}
                    />
                    <FormInput
                      label="HSC Score (%)"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.hsc}
                      onChange={(e) => setFormData({ ...formData, hsc: e.target.value })}
                    />
                    <FormInput
                      label="Graduation CGPA"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={formData.graduationCgpa}
                      onChange={(e) => setFormData({ ...formData, graduationCgpa: e.target.value })}
                    />
                    <FormInput
                      label="MBA Specialization"
                      value={formData.mbaSpecialization}
                      onChange={(e) => setFormData({ ...formData, mbaSpecialization: e.target.value })}
                    />
                  </div>
                </ModalForm>
              )}

            {/* Education Section */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">Education</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <p className="text-xs text-gray-300 mb-1">SSC %</p>
                  <p className="text-lg font-bold text-green-400">{student.ssc || 0}%</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                  <p className="text-xs text-gray-300 mb-1">HSC %</p>
                  <p className="text-lg font-bold text-blue-400">{student.hsc || 0}%</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20">
                  <p className="text-xs text-gray-300 mb-1">Graduation</p>
                  <p className="text-md font-bold text-purple-400">{student.graduationCgpa || 0}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20">
                  <p className="text-xs text-gray-300 mb-1">MBA</p>
                  <p className="text-sm font-bold text-pink-400">{student.mbaSpecialization || 'N/A'}</p>
                </div>
              </div>
            </motion.div>

            {/* SWOT Analysis */}
            <motion.div
              variants={cardVariants}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative"
            >
              {(currentUserRole === 'user' && isCurrentUser) && (
                <EditButtonComponent 
                  onClick={() => {
                    setFormData({
                      strengths: student.strengths || '',
                      weaknesses: student.weaknesses || '',
                      opportunities: student.opportunities || '',
                      threats: student.threats || ''
                    });
                    setActiveModal('swot');
                  }}
                />
              )}

              {activeModal === 'swot' && (
                <ModalForm
                  title="Edit SWOT Analysis"
                  onClose={() => setActiveModal(null)}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                      await updateDoc(doc(db, 'students', student.id), formData);
                      setActiveModal(null);
                      alert('Updated successfully!');
                    } catch (error) {
                      console.error('Error updating:', error);
                      alert('Error updating. Please try again.');
                    }
                    setLoading(false);
                  }}
                  loading={loading}
                >
                  <div className="space-y-4">
                    <FormTextarea
                      label="Strengths"
                      value={formData.strengths}
                      onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                      placeholder="List your key strengths..."
                    />
                    <FormTextarea
                      label="Weaknesses"
                      value={formData.weaknesses}
                      onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
                      placeholder="Areas for improvement..."
                    />
                    <FormTextarea
                      label="Opportunities"
                      value={formData.opportunities}
                      onChange={(e) => setFormData({ ...formData, opportunities: e.target.value })}
                      placeholder="Potential opportunities..."
                    />
                    <FormTextarea
                      label="Threats"
                      value={formData.threats}
                      onChange={(e) => setFormData({ ...formData, threats: e.target.value })}
                      placeholder="Potential challenges..."
                    />
                  </div>
                </ModalForm>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                  <TargetIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">SWOT Analysis</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-semibold text-white">Strengths</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {student.strengths || 'Strong analytical skills, leadership qualities, excellent communication'}
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-semibold text-white">Opportunities</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {student.opportunities || 'Growing tech industry, remote work options, emerging markets'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-semibold text-white">Weaknesses</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {student.weaknesses || 'Time management, public speaking, technical depth'}
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-rose-400" />
                      <span className="text-sm font-semibold text-white">Threats</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {student.threats || 'Market competition, automation, economic fluctuations'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Personality */}
            <motion.div
              variants={cardVariants}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative"
            >
              {(currentUserRole === 'user' && isCurrentUser) && (
                <EditButtonComponent 
                  onClick={() => {
                    setFormData({
                      mbtiCode: student.mbtiCode || '',
                      mbtiDescription: student.mbtiDescription || '',
                      hobbies: (student.hobbies || []).join(', ')
                    });
                    setActiveModal('personality');
                  }}
                />
              )}

              {activeModal === 'personality' && (
                <ModalForm
                  title="Edit Personality Details"
                  onClose={() => setActiveModal(null)}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                      const updatedData = {
                        ...formData,
                        hobbies: formData.hobbies.split(',').map(hobby => hobby.trim()).filter(hobby => hobby)
                      };
                      await updateDoc(doc(db, 'students', student.id), updatedData);
                      setActiveModal(null);
                      alert('Updated successfully!');
                    } catch (error) {
                      console.error('Error updating:', error);
                      alert('Error updating. Please try again.');
                    }
                    setLoading(false);
                  }}
                  loading={loading}
                >
                  <div className="space-y-4">
                    <FormInput
                      label="MBTI Personality Type"
                      value={formData.mbtiCode}
                      onChange={(e) => setFormData({ ...formData, mbtiCode: e.target.value })}
                      placeholder="e.g., INTJ, ENFP"
                      maxLength={4}
                    />
                    <FormTextarea
                      label="Personality Description"
                      value={formData.mbtiDescription}
                      onChange={(e) => setFormData({ ...formData, mbtiDescription: e.target.value })}
                      placeholder="Describe your personality type..."
                    />
                    <FormInput
                      label="Hobbies & Interests"
                      value={formData.hobbies}
                      onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                      placeholder="Separate hobbies with commas"
                    />
                  </div>
                </ModalForm>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">Personality</h2>
              </div>

              {/* MBTI Code */}
              <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">MBTI Personality</span>
                  <span className="text-lg font-bold text-indigo-400">{student.mbtiCode || 'INTJ'}</span>
                </div>
                <p className="text-xs text-gray-300">
                  {student.mbtiDescription || 'Architect - Strategic, analytical, and independent thinker'}
                </p>
              </div>

              {/* Hobbies & Interests */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span className="text-sm font-semibold text-white">Hobbies & Interests</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(student.hobbies || ['Reading', 'Technology', 'Sports', 'Music', 'Travel']).slice(0, 5).map((hobby, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 rounded-full bg-white/10 text-white text-xs border border-white/10"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Middle Column - Performance Metrics */}
          <div className="xl:col-span-3 space-y-8">
            {/* Overall Performance Card */}
            <motion.div
              variants={cardVariants}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Overall Performance</h2>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Grade</p>
                    <p className="text-lg font-bold text-cyan-400">
                      {student.grade || 'A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Current Status</p>
                    <p className={`text-lg font-bold ${getStatusColor(grandOverall)}`}>
                      {grandOverall >= 80 ? 'Excellent' : grandOverall >= 60 ? 'Good' : grandOverall >= 40 ? 'Average' : 'Needs Improvement'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Circular Progress */}
                <div className="flex justify-center">
                  <div className="relative">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="84"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-white/10"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="84"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                        strokeDasharray="528"
                        strokeDashoffset={528 - (528 * grandOverall) / 100}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#c084fc" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-white">{grandOverall.toFixed(1)}%</span>
                      <span className="text-sm text-gray-400 mt-1">Overall Score</span>
                    </div>
                  </div>
                </div>

                {/* Performance Breakdown */}
                <div className="space-y-6">
                  {[
                    { label: 'IRP Performance', value: irpOverall, icon: Brain },
                    { label: 'CLDP Skills', value: cldpOverall, icon: Target },
                    { label: 'Academic Scores', value: academicOverall, icon: BarChart3 },
                    { label: 'Attendance', value: attendanceOverall, icon: Clock }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-lg bg-white/10">
                            <item.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm text-gray-300">{item.label}</span>
                        </div>
                        <span className={`font-bold ${getStatusColor(item.value)}`}>
                          {item.value.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(item.value)} ${getGlowColor(item.value)} transition-all duration-1000 ease-out`}
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Areas of Excellence */}
              <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-emerald-400" />
                  <span className="text-lg font-bold text-white">Areas of Excellence</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getAreasOfExcellence().map((area, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium border border-emerald-500/30"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Career Objective */}
            <motion.div
              variants={cardVariants}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Career Objective</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                {student.careerObjective || 'To secure a challenging position in a reputable organization where I can utilize my skills and knowledge to contribute to organizational growth while pursuing personal and professional development.'}
              </p>
            </motion.div>

            {/* Detailed Performance Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* IRP Performance */}
              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.4 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">IRP Performance</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Overall</p>
                    <p className="text-xl font-bold text-orange-400">{irpOverall.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Aptitude', value: student.aptitudeOverall || 0 },
                    { label: 'Communication', value: student.bizCommunication || 0 },
                    { label: 'Tools & GenAI', value: student.genAI || 0 }
                  ].map((skill, index) => (
                    <div key={skill.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">{skill.label}</span>
                        <span className="font-bold text-white">{skill.value}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(skill.value)} transition-all duration-1000 ease-out`}
                          style={{ width: `${skill.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CLDP Skills */}
              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.5 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">CLDP Skills</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Overall</p>
                    <p className="text-xl font-bold text-indigo-400">{cldpOverall.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Business Communication', value: student.bizCommunication || 0 },
                    { label: 'GEN AI', value: student.genAI || 0 },
                    { label: 'LinkedIn Branding', value: student.linkedinBranding || 0 },
                    { label: 'Resume', value: student.resumecldp || 0 }
                  ].map((skill, index) => (
                    <div key={skill.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">{skill.label}</span>
                        <span className="font-bold text-white">{skill.value}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(skill.value)} transition-all duration-1000 ease-out`}
                          style={{ width: `${skill.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Attendance Records */}
              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.6 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Attendance Records</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Overall</p>
                    <p className="text-xl font-bold text-amber-400">{attendanceOverall.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Academic', value: student.academicsAttendance || 0 },
                    { label: 'IRP Phase 1', value: student.irpPhase1Attendance || 0 },
                    { label: 'IRP Phase 2', value: student.irpPhase2Attendance || 0 },
                    { label: 'CLDP', value: student.cldpAttendance || 0 }
                  ].map((attendance, index) => (
                    <div key={attendance.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">{attendance.label}</span>
                        <span className="font-bold text-white">{attendance.value}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(attendance.value)} transition-all duration-1000 ease-out`}
                          style={{ width: `${attendance.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Academic Performance */}
              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.7 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Academic Scores</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Overall</p>
                    <p className="text-xl font-bold text-emerald-400">{academicOverall.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Internal Academics', value: student.internalAcademics || 0 },
                    { label: 'External Academics', value: student.externalAcademics || 0 }
                  ].map((academic, index) => (
                    <div key={academic.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">{academic.label}</span>
                        <span className="font-bold text-white">{academic.value}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(academic.value)} transition-all duration-1000 ease-out`}
                          style={{ width: `${academic.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}