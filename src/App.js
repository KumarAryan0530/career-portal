// Main App Component with Routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import { Home } from './pages';

// Layout
import { Layout } from './components/layout';

// Auth Components
import { Login, Signup, ProtectedRoute } from './components/auth';

// Candidate Components
import {
  CandidateDashboard,
  JobListings,
  JobDetail,
  CandidateApplications,
  CandidateProfile
} from './components/candidate';

// Recruiter Components
import {
  RecruiterDashboard,
  JobManagement,
  JobForm,
  JobDetail as RecruiterJobDetail,
  ApplicantsView,
  RecruiterProfile
} from './components/recruiter';

// Styles
import './styles/globals.css';
import './styles/components/Button.css';
import './styles/components/Card.css';
import './styles/components/Form.css';
import './styles/components/Badge.css';

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { userRole, loading, currentUser } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="spinner" />
      </div>
    );
  }

  // If no user, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (userRole === 'recruiter') {
    return <Navigate to="/recruiter/dashboard" replace />;
  }
  
  // Default to candidate dashboard
  return <Navigate to="/candidate/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#2D2D2D',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderRadius: '12px',
              padding: '12px 16px'
            },
            success: {
              iconTheme: {
                primary: '#2E7D32',
                secondary: '#fff'
              }
            },
            error: {
              iconTheme: {
                primary: '#C41E3A',
                secondary: '#fff'
              }
            }
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard Redirect */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleBasedRedirect />
              </ProtectedRoute>
            }
          />

          {/* Candidate Routes */}
          <Route
            path="/candidate/dashboard"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <Layout>
                  <CandidateDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/jobs"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <Layout>
                  <JobListings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/jobs/:id"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <Layout>
                  <JobDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/applications"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <Layout>
                  <CandidateApplications />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/profile"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <Layout>
                  <CandidateProfile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Recruiter Routes */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <Layout>
                  <RecruiterDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <Layout>
                  <JobManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/new"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <Layout>
                  <JobForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:id"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <Layout>
                  <RecruiterJobDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <Layout>
                  <JobForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:jobId/applicants"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <Layout>
                  <ApplicantsView />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/applicants"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <Layout>
                  <ApplicantsView />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/profile"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <Layout>
                  <RecruiterProfile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
