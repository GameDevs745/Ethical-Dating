// src/components/SwipePage.js
import { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc,
  doc, 
  setDoc 
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import SwipeCard from './SwipeCard';
import { Container, Typography } from '@mui/material';

const SwipePage = () => {
  const { currentUser } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Get current user's preferences
        const currentUserRef = doc(db, 'users', currentUser.uid);
        const currentUserSnap = await getDoc(currentUserRef);
        
        if (!currentUserSnap.exists()) {
          setError('User profile not found');
          return;
        }

        const currentUserData = currentUserSnap.data();

        // Get all swipes by current user
        const swipesSnapshot = await getDocs(
          query(
            collection(db, 'swipes'),
            where('swiper', '==', currentUser.uid)
          )
        );
        const swipedUserIds = swipesSnapshot.docs.map(doc => doc.data().swiped);

        // Query compatible profiles
        const q = query(
          collection(db, 'users'),
          where('gender', 'in', currentUserData.preference === 'both' 
            ? ['male', 'female'] 
            : [currentUserData.preference]),
          where('__name__', '!=', currentUser.uid)
        );

        const querySnapshot = await getDocs(q);
        const profilesData = querySnapshot.docs
          .filter(doc => !swipedUserIds.includes(doc.id))
          .map(doc => ({ id: doc.id, ...doc.data() }));

        setProfiles(profilesData);
        setError('');
      } catch (err) {
        setError('Failed to load profiles: ' + err.message);
        console.error(err);
      }
    };

    fetchProfiles();
  }, [currentUser]);

  const handleSwipe = async (direction) => {
    try {
      const swipedUser = profiles[currentIndex];
      
      // Record swipe
      await setDoc(doc(db, 'swipes', `${currentUser.uid}_${swipedUser.id}`), {
        swiper: currentUser.uid,
        swiped: swipedUser.id,
        direction,
        timestamp: new Date(),
      });

      // Check for match
      if (direction === 'right') {
        const matchRef = doc(db, 'swipes', `${swipedUser.id}_${currentUser.uid}`);
        const matchCheck = await getDoc(matchRef);
        
        if (matchCheck.exists() && matchCheck.data().direction === 'right') {
          await setDoc(doc(db, 'matches', `${currentUser.uid}_${swipedUser.id}`), {
            users: [currentUser.uid, swipedUser.id],
            timestamp: new Date(),
          });
          alert(`It's a match with ${swipedUser.name}!`);
        }
      }

      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      setError('Swipe failed: ' + err.message);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {profiles.length === 0 && !error && (
        <Typography>Loading profiles...</Typography>
      )}

      {currentIndex >= profiles.length && !error && (
        <Typography>No more profiles to show!</Typography>
      )}

      {profiles.length > 0 && currentIndex < profiles.length && (
        <SwipeCard
          profile={profiles[currentIndex]}
          onSwipeLeft={() => handleSwipe('left')}
          onSwipeRight={() => handleSwipe('right')}
        />
      )}
    </Container>
  );
};

export default SwipePage;