import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import ProtectedRoute from './admin/components/ProtectedRoute';
import SupportChatWidget from './components/SupportChatWidget';
import { db, auth } from './firebase';
import './App.css';

const HomePage = lazy(() => import('./user/components/HomePage'));
const TrackingPage = lazy(() => import('./user/components/TrackingPage'));
const AdminLogin = lazy(() => import('./admin/components/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/components/AdminDashboard'));

function App() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Auth Listener
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });

    const q = query(collection(db, "packages"), orderBy("id", "desc"));

    // Check if initial seed is needed (optional)
    const checkAndSeed = async () => {
      try {
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          console.log("No demo data needed - production ready");
        }
      } catch (err) {
        console.error("Database check error:", err);
        if (err.code === 'permission-denied') {
          setError("Firebase Permission Denied. Please update your Firestore Rules in the Firebase Console.");
        }
      }
    };
    checkAndSeed();

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pkgs = snapshot.docs.map(doc => ({
        firestoreId: doc.id,
        ...doc.data()
      }));
      setPackages(pkgs);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Firestore error:", err);
      if (err.code === 'permission-denied') {
        setError("Missing or insufficient permissions. Have you updated your Firestore Rules to 'allow read, write: if true;' in the Firebase console?");
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  if (error) {
    return (
      <div className="loading-screen" style={{ flexDirection: 'column', textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ color: '#dc3545' }}>⚠️ Firebase Permission Error</h2>
        <p style={{ maxWidth: '600px', margin: '1rem 0', lineHeight: '1.6' }}>{error}</p>
        <div style={{ background: '#eee', padding: '1rem', borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem' }}>
          <strong>Action Required:</strong><br />
          1. Go to Firebase Console &gt; Firestore Database &gt; Rules.<br />
          2. Set rules to:<br />
          <pre style={{ background: '#333', color: '#fff', padding: '0.5rem', marginTop: '0.5rem' }}>
            {"allow read, write: if true;"}
          </pre>
        </div>
        <button onClick={() => window.location.reload()} style={{ marginTop: '1.5rem', padding: '0.8rem 1.5rem', background: '#0d6efd', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          I've updated the rules, reload app
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="loading-screen">Loading FluxExpress Dashboard...</div>;
  }

  const routeFallback = <div>Loading...</div>;

  return (
    <div className="App">
      <Routes>
        {/* User Routes */}
        <Route
          path="/"
          element={
            <Suspense fallback={routeFallback}>
              <HomePage packages={packages} />
            </Suspense>
          }
        />
        <Route
          path="/track/:code"
          element={
            <Suspense fallback={routeFallback}>
              <TrackingPage packages={packages} />
            </Suspense>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={routeFallback}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <Suspense fallback={routeFallback}>
              <ProtectedRoute user={authUser}>
                <AdminDashboard packages={packages} />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <Suspense fallback={routeFallback}>
              <HomePage packages={packages} />
            </Suspense>
          }
        />
      </Routes>
      {!isAdminPath && (() => {
        // Extract tracking code from /track/:code URL
        const match = location.pathname.match(/^\/track\/(.+)$/);
        const code = match ? match[1] : null;
        return <SupportChatWidget trackingCode={code} />;
      })()}
    </div>
  );
}

export default App;
