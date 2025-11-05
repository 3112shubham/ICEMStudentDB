// components/sections/StudentJourney.js
'use client';

import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, VenusAndMars, BookOpen, 
  Brain, Award, TrendingUp, BarChart3, GraduationCap,
  Target, Clock, Star, Zap, Rocket
} from 'lucide-react';

export default function StudentJourney({ student }) {
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
            {/* Profile Card */}
            <motion.div
              variants={cardVariants}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Student Profile</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="font-semibold text-white text-lg">{student.name || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <Mail className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-semibold text-white text-lg">{student.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <MapPin className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-xs text-gray-400">Campus</p>
                      <p className="font-medium text-white text-sm">{student.campus || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <VenusAndMars className="w-4 h-4 text-pink-400" />
                    <div>
                      <p className="text-xs text-gray-400">Gender</p>
                      <p className="font-medium text-white text-sm">{student.gender || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <Phone className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-xs text-gray-400">Mobile</p>
                      <p className="font-medium text-white text-sm">{student.mobile || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-xs text-gray-400">Roll Number</p>
                      <p className="font-medium text-white text-sm">{student.rollNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Education Card */}
            <motion.div
              variants={cardVariants}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Education Background</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <p className="text-sm text-gray-300 mb-1">SSC %</p>
                  <p className="text-2xl font-bold text-green-400">{student.ssc || 0}%</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                  <p className="text-sm text-gray-300 mb-1">HSC %</p>
                  <p className="text-2xl font-bold text-blue-400">{student.hsc || 0}%</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20">
                  <p className="text-sm text-gray-300 mb-1">Graduation</p>
                  <p className="text-xl font-bold text-purple-400">{student.graduationCgpa || 0}</p>
                  <p className="text-xs text-gray-400 mt-1">{student.graduation || 'N/A'}</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20">
                  <p className="text-sm text-gray-300 mb-1">MBA</p>
                  <p className="text-lg font-bold text-pink-400">{student.mbaSpecialization || 'N/A'}</p>
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
                      {student.grade || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Current Status</p>
                    <p className={`text-lg font-bold ${getStatusColor(grandOverall)}`}>
                      {grandOverall >= 80 ? 'Excellent' : grandOverall >= 60 ? 'Good' : grandOverall >= 40 ? 'Average' : 'Needs Improvement'}
                    </p>
                  </div>
                </div>
              </div>              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
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
            </motion.div>

            {/* Detailed Performance Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* IRP Performance */}
              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.3 }}
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

              {/* Academic Performance */}
              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.4 }}
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

              {/* Attendance Records */}
              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.5 }}
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

              {/* CLDP Skills */}
              <motion.div
                variants={cardVariants}
                transition={{ delay: 0.6 }}
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
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}