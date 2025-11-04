// components/sections/StudentJourney.js
'use client';

import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, VenusAndMars, BookOpen, Brain, Award, TrendingUp, BarChart3 } from 'lucide-react';

export default function StudentJourney({ student }) {
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
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
        <p className="text-gray-400">No student data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Left Column */}
      <div className="space-y-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <User className="w-6 h-6 text-cyan-400" />
            Student Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <User className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-300">Name</p>
                <p className="font-semibold text-white">{student.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Award className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-300">Roll Number</p>
                <p className="font-semibold text-white">{student.rollNumber || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-300">Campus</p>
                <p className="font-semibold text-white">{student.campus || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <VenusAndMars className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-300">Gender</p>
                <p className="font-semibold text-white">{student.gender || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Phone className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-300">Mobile</p>
                <p className="font-semibold text-white">{student.mobile || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Mail className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-300">Email</p>
                <p className="font-semibold text-white">{student.email || 'N/A'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Education Background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <BookOpen className="w-6 h-6 text-purple-400" />
            Education Background
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-gray-300">SSC %</p>
              <p className="text-2xl font-bold text-green-400">{student.ssc || 0}%</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-gray-300">HSC %</p>
              <p className="text-2xl font-bold text-blue-400">{student.hsc || 0}%</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-gray-300">Graduation</p>
              <p className="text-lg font-bold text-purple-400">{student.graduationCgpa || 0}</p>
              <p className="text-xs text-gray-300 mt-1">{student.graduation || 'N/A'}</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-gray-300">MBA</p>
              <p className="text-lg font-bold text-pink-400">{student.mbaSpecialization || 'N/A'}</p>
            </div>
          </div>
        </motion.div>

        {/* Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* IRP Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <Brain className="w-5 h-5 text-orange-400" />
                IRP Performance
              </h3>
              <div className="text-right">
                <p className="text-sm text-gray-300">Overall</p>
                <p className="text-xl font-bold text-orange-400">{irpOverall.toFixed(1)}%</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Aptitude</span>
                <span className="font-bold text-white">{student.aptitudeOverall || 0}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(student.aptitudeOverall || 0)}`}
                  style={{ width: `${student.aptitudeOverall || 0}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Communication</span>
                <span className="font-bold text-white">{student.bizCommunication || 0}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(student.bizCommunication || 0)}`}
                  style={{ width: `${student.bizCommunication || 0}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Tools & GenAI</span>
                <span className="font-bold text-white">{student.genAI || 0}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(student.genAI || 0)}`}
                  style={{ width: `${student.genAI || 0}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Academic Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <BarChart3 className="w-5 h-5 text-green-400" />
                Academic Scores
              </h3>
              <div className="text-right">
                <p className="text-sm text-gray-300">Overall</p>
                <p className="text-xl font-bold text-green-400">{academicOverall.toFixed(1)}%</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Internal</span>
                <span className="font-bold text-white">{student.internalAcademics || 0}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(student.internalAcademics || 0)}`}
                  style={{ width: `${student.internalAcademics || 0}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">External</span>
                <span className="font-bold text-white">{student.externalAcademics || 0}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(student.externalAcademics || 0)}`}
                  style={{ width: `${student.externalAcademics || 0}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Overall Performance Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            Overall Performance
          </h2>
          
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className="inline-block relative">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/10"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-cyan-400 transition-all duration-1000 ease-out"
                    strokeDasharray="439.6"
                    strokeDashoffset={439.6 - (439.6 * grandOverall) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{grandOverall.toFixed(1)}%</span>
                  <span className="text-sm text-gray-300">Overall Score</span>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">IRP Performance</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(irpOverall)}`}
                      style={{ width: `${irpOverall}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-white w-12 text-right">{irpOverall.toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">CLDP Skills</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(cldpOverall)}`}
                      style={{ width: `${cldpOverall}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-white w-12 text-right">{cldpOverall.toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Academic Scores</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(academicOverall)}`}
                      style={{ width: `${academicOverall}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-white w-12 text-right">{academicOverall.toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Attendance</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(attendanceOverall)}`}
                      style={{ width: `${attendanceOverall}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-white w-12 text-right">{attendanceOverall.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Attendance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <Award className="w-5 h-5 text-yellow-400" />
              Attendance Records
            </h3>
            <div className="text-right">
              <p className="text-sm text-gray-300">Overall</p>
              <p className="text-xl font-bold text-yellow-400">{attendanceOverall.toFixed(1)}%</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Academic</span>
              <span className="font-bold text-white">{student.academicsAttendance || 0}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(student.academicsAttendance || 0)}`}
                style={{ width: `${student.academicsAttendance || 0}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">IRP Phase 1</span>
              <span className="font-bold text-white">{student.irpPhase1Attendance || 0}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(student.irpPhase1Attendance || 0)}`}
                style={{ width: `${student.irpPhase1Attendance || 0}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">IRP Phase 2</span>
              <span className="font-bold text-white">{student.irpPhase2Attendance || 0}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(student.irpPhase2Attendance || 0)}`}
                style={{ width: `${student.irpPhase2Attendance || 0}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">CLDP</span>
              <span className="font-bold text-white">{student.cldpAttendance || 0}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(student.cldpAttendance || 0)}`}
                style={{ width: `${student.cldpAttendance || 0}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* CLDP Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              CLDP Skills
            </h3>
            <div className="text-right">
              <p className="text-sm text-gray-300">Overall</p>
              <p className="text-xl font-bold text-indigo-400">{cldpOverall.toFixed(1)}%</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Business Communication</span>
              <span className="font-bold text-white">{student.bizCommunication || 0}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(student.bizCommunication || 0)}`}
                style={{ width: `${student.bizCommunication || 0}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">GEN AI</span>
              <span className="font-bold text-white">{student.genAI || 0}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(student.genAI || 0)}`}
                style={{ width: `${student.genAI || 0}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">LinkedIn Branding</span>
              <span className="font-bold text-white">{student.linkedinBranding || 0}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(student.linkedinBranding || 0)}`}
                style={{ width: `${student.linkedinBranding || 0}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Resume</span>
              <span className="font-bold text-white">{student.resumecldp || 0}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(student.resumecldp || 0)}`}
                style={{ width: `${student.resumecldp || 0}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        
      </div>
    </motion.div>
  );
}