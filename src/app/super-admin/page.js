'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, deleteUser, signOut } from 'firebase/auth';
import { db, auth } from '../../lib/firebase';
import { Users, Plus, Building2, Trash2, Edit2, X, Check, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import RouteGuard from '../components/RouteGuard';
import Navbar from '../components/Navbar';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The RouteGuard will automatically redirect to login page after signOut
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
    }
  };
  
  // New user form state
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'user',
    name: '',
    department: '',
    college: ''
  });

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );

      // Add user details to Firestore
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        department: newUser.department,
        college: newUser.college,
        createdAt: new Date().toISOString()
      });

      // Reset form and close modal
      setNewUser({
        email: '',
        password: '',
        role: 'user',
        name: '',
        department: '',
        college: ''
      });
      setShowAddUser(false);
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error adding user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (window.confirm(`Are you sure you want to delete ${userEmail}?`)) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        // Note: Deleting the actual Firebase auth user requires Admin SDK
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <RouteGuard superAdminOnly>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 font-poppins text-white p-4">
        {/* Navbar */}
        <Navbar onLogout={handleLogout} />
        
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
              <p className="text-gray-400">Manage users, roles, and colleges</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/super-admin/college')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
              >
                <Building2 className="w-5 h-5" />
                Add College
              </button>
              <button
                onClick={() => setShowAddUser(true)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add New User
              </button>
            </div>
          </div>

          {/* Users List */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-6 gap-4 p-4 border-b border-white/10 font-medium text-gray-300">
              <div className="col-span-2">User</div>
              <div>Role</div>
              <div>Department</div>
              <div>College</div>
              <div>Actions</div>
            </div>
            <div className="divide-y divide-white/10">
              {users.map((user) => (
                <div key={user.id} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-white/5">
                  <div className="col-span-2">
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                  <div>
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className="bg-transparent border border-white/20 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                  <div className="text-gray-300">{user.department}</div>
                  <div className="text-gray-300">{user.college}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteUser(user.id, user.email)}
                      className="p-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add User Modal */}
        <AnimatePresence>
          {showAddUser && (
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
                className="bg-gray-800 w-full max-w-md rounded-2xl shadow-lg"
              >
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                  <h2 className="text-2xl font-bold">Add New User</h2>
                  <button
                    onClick={() => setShowAddUser(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleAddUser} className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-gray-300">Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300">Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300">Password</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300">Department</label>
                    <input
                      type="text"
                      value={newUser.department}
                      onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300">College</label>
                    <input
                      type="text"
                      value={newUser.college}
                      onChange={(e) => setNewUser({ ...newUser, college: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-white font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add User'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RouteGuard>
  );
}