import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireProfile = true,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // or a loading spinner
  }

  // Not authenticated, redirect to login
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but no profile, redirect to profile setup
  if (requireAuth && requireProfile && user && !user.isProfileComplete) {
    return <Navigate to="/profile-setup" replace />;
  }

  // Already authenticated and trying to access login page
  if (!requireAuth && user) {
    return <Navigate to={user.isProfileComplete ? '/dashboard' : '/profile-setup'} replace />;
  }

  return <>{children}</>;
};
