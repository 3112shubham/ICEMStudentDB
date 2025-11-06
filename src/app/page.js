// app/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { Search, Upload, Download, Filter, X, ChevronDown } from 'lucide-react';
import CSVUpload from './components/ui/FileUpload';
import StudentJourney from './components/sections/StudentJourney';
import Navbar from './components/Navbar';

import RouteGuard from './components/RouteGuard';

export default function StudentJourneyDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (auth.currentUser) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setIsAdmin(userData.role === 'admin');
        }
      }
    };

    checkUserRole();
  }, []);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.search-container')) {
        setDropdownOpen(false);
      }
      if (filterOpen && !event.target.closest('.filter-container')) {
        setFilterOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen, filterOpen]);

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'students'));
      const studentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentsData);
      if (studentsData.length > 0 && !selectedStudent) {
        setSelectedStudent(studentsData[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  const handleCSVUpload = async (csvData) => {
    setUploading(true);
    try {
      // Step 1: Clear existing data
      const querySnapshot = await getDocs(collection(db, 'students'));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Step 2: Upload each row column-wise (skipping headers)
      for (let i = 1; i < csvData.length; i++) {
        const row = csvData[i];

        // Parse numeric fields safely
        const num = (val) => parseFloat(val) || 0;

        const student = {
          name: row[0]?.trim() || '',
          rollNumber: row[1]?.trim() || '',
          campus: row[2]?.trim() || '',
          gender: row[3]?.trim() || '',
          mobile: row[4]?.trim() || '',
          email: row[5]?.trim() || '',
          ssc: num(row[6]),
          hsc: num(row[7]),
          graduation: row[8]?.trim() || '',
          graduationCgpa: num(row[9]),
          mbaSpecialization: row[10]?.trim() || '',
          aptitudePre: num(row[11]),
          aptitudePost: num(row[12]),
          aptitudeOverall: (num(row[11]) + num(row[12])) / 2,
          communication: num(row[13]),
          tools: num(row[14]),
          irpOverall: (num(row[11]) + num(row[12]) + num(row[13]) + num(row[14])) / 4,
          bizCommunication: num(row[15]),
          genAI: num(row[16]),
          linkedinBranding: num(row[17]),
          resumecldp: num(row[18]),
          cldpOverall: (num(row[15]) + num(row[16]) + num(row[17]) + num(row[18])) / 4,
          internalAcademics: num(row[19]),
          externalAcademics: num(row[20]),
          overallAcademics: (num(row[19]) + num(row[20])) / 2,
          academicsAttendance: num(row[21]),
          irpPhase1Attendance: num(row[22]),
          irpPhase2Attendance: num(row[23]),
          cldpAttendance: num(row[24]),
          attendanceOverall: (num(row[21]) + num(row[22]) + num(row[23]) + num(row[24])) / 4,
          score: num(row[25]),
          grade: row[26]?.trim() || '',
          semester: row[27]?.trim() || 'Semester 1', // Add semester field
          timestamp: new Date().toISOString(),
        };

        await addDoc(collection(db, 'students'), student);
      }

      await fetchStudents();
      setShowUpload(false);
      alert('Student data uploaded successfully!');
    } catch (error) {
      console.error('Error uploading data:', error);
      alert('Error uploading data. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The RouteGuard will automatically redirect to login page after signOut
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSemester = semesterFilter === 'all' || student.semester === semesterFilter;
    
    return matchesSearch && matchesSemester;
  });

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setDropdownOpen(false);
    setSearchTerm('');
  };

  const getUniqueSemesters = () => {
    const semesters = [...new Set(students.map(student => student.semester).filter(Boolean))];
    return semesters.length > 0 ? semesters : ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 font-poppins text-white p-4">
      {/* Navbar */}
      <Navbar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="p-4">
        {/* Compact Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto mb-6"
        >
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {/* Left Side - Search */}
            {students.length > 0 && isAdmin && (
              <div className="flex-1 max-w-2xl">
                <div className="relative search-container">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search students by name or roll number..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setDropdownOpen(true);
                      }}
                      onFocus={() => setDropdownOpen(true)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  {/* Dropdown Results */}
                  <AnimatePresence>
                    {dropdownOpen && searchTerm && filteredStudents.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-40 max-h-64 overflow-y-auto"
                      >
                        {filteredStudents.map((student, index) => (
                          <motion.div
                            key={student.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleStudentSelect(student)}
                            className="p-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-b-0 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-white text-sm">{student.name}</p>
                                <p className="text-xs text-gray-300">{student.rollNumber} • {student.campus}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-cyan-400 font-semibold">
                                  {((student.irpOverall + student.cldpOverall + student.overallAcademics + student.attendanceOverall) / 4).toFixed(1)}%
                                </p>
                                <p className="text-xs text-gray-400">Overall</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Right Side - Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Semester Filter */}
              {students.length > 0 && (
                <div className="relative filter-container">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors text-sm"
                  >
                    <Filter className="w-4 h-4" />
                    <span>{semesterFilter === 'all' ? 'All Semesters' : semesterFilter}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  <AnimatePresence>
                    {filterOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-40 min-w-48"
                      >
                        <div className="p-2">
                          <button
                            onClick={() => {
                              setSemesterFilter('all');
                              setFilterOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              semesterFilter === 'all' 
                                ? 'bg-cyan-500/20 text-cyan-400' 
                                : 'hover:bg-white/10'
                            }`}
                          >
                            All Semesters
                          </button>
                          {getUniqueSemesters().map((semester) => (
                            <button
                              key={semester}
                              onClick={() => {
                                setSemesterFilter(semester);
                                setFilterOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                semesterFilter === semester 
                                  ? 'bg-cyan-500/20 text-cyan-400' 
                                  : 'hover:bg-white/10'
                              }`}
                            >
                              {semester}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Add/Update Data Button */}
              {isAdmin ? (
                <button
                  onClick={() => setShowUpload(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-colors text-sm font-medium"
                >
                  <Upload className="w-4 h-4" />
                  Add Data
                </button>
              ) : (
                <button
                  onClick={() => router.push('/form')}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-colors text-sm font-medium"
                >
                  <Upload className="w-4 h-4" />
                  Update My Info
                </button>
              )}
            </div>
          </div>

        </motion.div>

        {/* CSV Upload Modal */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gray-800 w-full max-w-3xl rounded-2xl shadow-lg border border-white/10"
              >
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                  <h2 className="text-2xl font-bold">Upload Student Data</h2>
                  <button
                    onClick={() => setShowUpload(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6">
                  <CSVUpload onUpload={handleCSVUpload} uploading={uploading} />
                </div>
                <div className="flex justify-end gap-4 p-6 border-t border-white/10">
                  <button
                    onClick={() => setShowUpload(false)}
                    className="px-6 py-3 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {students.length > 0 ? (
          <>
            {/* Student Journey */}
            <AnimatePresence mode="wait">
              {selectedStudent && (
                <StudentJourney student={selectedStudent} />
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Upload className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">No Student Data</h2>
            <p className="text-gray-400 mb-6">
              Upload a CSV file to get started with the Student Journey Dashboard
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-2xl transition-colors"
            >
              Upload CSV Data
            </button>
          </motion.div>
        )}
      </div>
    </div>
    </RouteGuard>
  );
}