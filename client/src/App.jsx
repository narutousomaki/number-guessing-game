import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import API from './services/api';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LeaderboardPage from './pages/LeaderboardPage';
import Profile from './pages/Profile';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // Verify token by querying score history (acts as auth test)
          await API.get('/scores/history');
          setUser(JSON.parse(savedUser));
        } catch (err) {
          console.error('Session validation failed:', err);
          // Invalid token: clean up
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Router>
      <Navbar user={user} logout={logout} />
      <main>
        <Routes>
          {/* Protected Gameplay Dashboard */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Dashboard user={user} />
              </ProtectedRoute>
            } 
          />

          {/* Protected User Profile & History */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Profile user={user} />
              </ProtectedRoute>
            } 
          />

          {/* Public Leaderboard */}
          <Route path="/leaderboard" element={<LeaderboardPage />} />

          {/* Authentication Paths (redirects to play deck if already logged in) */}
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" replace /> : <Login login={login} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" replace /> : <Register login={login} />} 
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
