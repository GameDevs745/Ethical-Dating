// src/components/SwipePage.js
import { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc, // ADD THIS
  doc,    // ADD THIS
  setDoc 
} from 'firebase/firestore';// ADD getDoc
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import SwipeCard from './SwipeCard';
import { Container, Typography } from '@mui/material';

const SwipePage = () => {
  const { currentUser } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProfiles = async () => {
      // FIXED: Use getDoc instead of getDocs for single document
       try { // Add try block here
        const currentUserRef = doc(db, 'users', currentUser.uid);
        const currentUserSnap = await getDoc(currentUserRef);
        
        if (!currentUserSnap.exists()) {
          console.log("No user data!");
          return;
        }

        const currentUserData = currentUserSnap.data();

        // Query compatible profiles
         const q = query(
          collection(db, 'users'),
          where('gender', 'in', currentUserData.preference === 'both' 
            ? ['male', 'female'] 
            : [currentUserData.preference])
        );

        const querySnapshot = await getDocs(q);
        const profilesData = querySnapshot.docs
          .filter(doc => doc.id !== currentUser.uid)
          .map(doc => ({ id: doc.id, ...doc.data() }));

        setProfiles(profilesData);
        setError(''); // Clear errors on success
      } catch (err) { // Add catch block here
        setError('Failed to load profiles: ' + err.message);
        console.error(err);
      }
    };

    fetchProfiles();
  }, [currentUser]);
      const swipesSnapshot = await getDocs(
  query(
    collection(db, 'swipes'),
    where('swiper', '==', currentUser.uid)
  )
);

const swipedUserIds = swipesSnapshot.docs.map(doc => doc.data().swiped);
const filteredProfiles = profilesData.filter(
  profile => !swipedUserIds.includes(profile.id)
);

setProfiles(filteredProfiles);
    };

    fetchProfiles();
  }, [currentUser]);

  const handleSwipe = async (direction) => {
    const swipedUser = profiles[currentIndex];
    
    // Record swipe
    await setDoc(doc(db, 'swipes', `${currentUser.uid}_${swipedUser.id}`), {
      swiper: currentUser.uid,
      swiped: swipedUser.id,
      direction,
      timestamp: new Date(),
    });

    // Check for match - FIXED: Use getDoc here too
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
  };

  if (profiles.length === 0) return <Typography>Loading profiles...</Typography>;
  if (currentIndex >= profiles.length) return <Typography>No more profiles to show!</Typography>;

  return (
    <Container sx={{ py: 4 }}>
      {/* Add error display here */}
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