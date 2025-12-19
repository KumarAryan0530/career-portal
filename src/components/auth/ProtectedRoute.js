// Protected Route Component
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingOverlay } from '../shared/Spinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingOverlay message="Authenticating..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = userRole === 'recruiter' 
      ? '/recruiter/dashboard' 
      : '/candidate/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
