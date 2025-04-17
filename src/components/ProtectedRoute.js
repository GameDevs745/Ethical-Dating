import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ProtectedRoute = ({ children, requireProfileComplete }) => {
  const { currentUser } = useAuth() || {};
  const [profileChecked, setProfileChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      if (!requireProfileComplete || !currentUser) {
        setProfileChecked(true);
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (!userDoc.exists() || !userDoc.data().gender || !userDoc.data().preference) {
        navigate('/profile');
      }
      setProfileChecked(true);
    };

    checkProfile();
  }, [currentUser, requireProfileComplete, navigate]);

  if (!currentUser) return <Navigate to="/login" />;
  if (requireProfileComplete && !profileChecked) return <div>Loading...</div>;
  
  return children;
};

export default ProtectedRoute;