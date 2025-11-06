'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export default function RouteGuard({ children, adminOnly = false, superAdminOnly = false }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async (uid) => {
      try {
        // First try to get the document by UID as document ID
        const userDoc = await getDocs(collection(db, 'users'));
        const user = userDoc.docs.find(doc => doc.id === uid);
        if (user) {
          console.log('Found user document:', user.data());
          return user.data().role;
        }

        // Fallback to querying by uid field
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          console.log('Found user by uid field:', userData);
          return userData.role;
        }
        
        console.log('No user document found for uid:', uid);
        return 'user';
      } catch (error) {
        console.error('Error checking user role:', error);
        return 'user';
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log('No user found, redirecting to login');
        setAuthorized(false);
        setUserRole(null);
        router.push('/login');
      } else {
        console.log('User authenticated:', user.email);
        const role = await checkUserRole(user.uid);
        console.log('User role:', role);
        setUserRole(role);

        // If we're on the root path and user is admin or super_admin, redirect to appropriate dashboard
        if (window.location.pathname === '/') {
          if (role === 'super_admin') {
            router.push('/super-admin');
            setAuthorized(false);
            return;
          } else if (role === 'admin') {
            router.push('/admin');
            setAuthorized(false);
            return;
          }
        }
        
        // Handle route access based on role
        if (superAdminOnly && role !== 'super_admin') {
          console.log('Not a super admin, redirecting to appropriate page');
          if (role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/');
          }
          setAuthorized(false);
        } else if (adminOnly && !['admin', 'super_admin'].includes(role)) {
          console.log('Not an admin, redirecting to home');
          router.push('/');
          setAuthorized(false);
        } else {
          console.log('Access authorized');
          setAuthorized(true);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, adminOnly, superAdminOnly]);

  if (loading || !authorized) {
    return null;
  }

  return children;
}