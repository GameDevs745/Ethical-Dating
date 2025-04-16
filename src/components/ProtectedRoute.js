// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth() || {}; // Add fallback
  return currentUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;