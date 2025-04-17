import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../data/userService';
import CircularProgress from '@mui/material/CircularProgress';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      setProfileLoading(true);
      if (user) {
        try {
          const profile = await userService.getUser(user.id);
          setProfileComplete(!!profile?.gender && !!profile?.preference);
        } catch (error) {
          console.error('Profile check error:', error);
        }
      }
      setProfileLoading(false);
    };
    checkProfile();
  }, [user]);

  if (loading || profileLoading) {
    return <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />;
  }

  if (!user) return <Navigate to="/login" />;
  if (!profileComplete) return <Navigate to="/profile" />;
  
  return children;
};

export default ProtectedRoute;