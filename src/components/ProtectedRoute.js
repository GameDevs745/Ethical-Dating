import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../data/userService';
import CircularProgress from '@mui/material/CircularProgress';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const checkProfile = async () => {
    setLoading(true);
    if (user) {
      const profile = await userService.getUser(user.id);
      setProfileComplete(!!profile?.gender && !!profile?.preference);
    }
    setLoading(false);
  };
  checkProfile();
}, [user]);
  if (loading) return <CircularProgress />;
  if (!user) return <Navigate to="/login" />;
  if (!profileComplete) return <Navigate to="/profile" />;
  
  return children;
};

export default ProtectedRoute;