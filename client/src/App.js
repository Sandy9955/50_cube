import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import MerchPage from './pages/MerchPage';
import AdminMetricsPage from './pages/AdminMetricsPage';
import AdminLanesPage from './pages/AdminLanesPage';
import AdminProductPage from './pages/AdminProductPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import UserProfilePage from './pages/UserProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import LandingPage from './pages/LandingPage';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/merch" element={
              <ProtectedRoute>
                <MerchPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/metrics" element={
              <AdminProtectedRoute>
                <AdminMetricsPage />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/lanes" element={
              <AdminProtectedRoute>
                <AdminLanesPage />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/products" element={
              <AdminProtectedRoute>
                <AdminProductPage />
              </AdminProtectedRoute>
            } />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Routes>
          <Route path="/" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
