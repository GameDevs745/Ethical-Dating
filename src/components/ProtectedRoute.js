import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../data/userService';
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const [profileComplete, setProfileComplete] = useState(false);

 useEffect(() => {
  const checkProfile = async () => {
    if (user) {
      const profile = await userService.getUser(user.id);
      setProfileComplete(!!profile?.gender && !!profile?.preference);
    }
  };
  checkProfile();
}, [user]);

  if (!user) return <Navigate to="/login" />;
  if (!profileComplete) return <Navigate to="/profile" />;
  
  return children;
};

export default ProtectedRoute;