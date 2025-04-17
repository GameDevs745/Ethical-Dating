// src/components/SwipePage.js
import { useNavigate } from 'react-router-dom'; // Add this
import { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc,
  doc, 
  setDoc,
  documentId ,
  writeBatch,
  
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import SwipeCard from './SwipeCard';
import { Container, Typography } from '@mui/material';

const SwipePage = () => {
  const { currentUser } = useAuth();
  const [profiles, setProfiles] = useState([]);
    const navigate = useNavigate(); // Add this
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
         const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (!userDoc.exists() || !userDoc.data().gender || !userDoc.data().preference) {
        navigate('/profile');
        return;
      }
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
  where('gender', 'in', 
    currentUserData.preference === 'both' 
      ? ['male', 'female'] 
      : [currentUserData.preference]
  ),
  where(documentId(), '!=', currentUser.uid)
);

        const querySnapshot = await getDocs(q);
        const profilesData = querySnapshot.docs
          .filter(doc => !swipedUserIds.includes(doc.id))
          .map(doc => ({ id: doc.id, ...doc.data() }));

        setProfiles(profilesData);
        setError('');
      } catch (err) {
        
      }
    };

    fetchProfiles();
 }, [currentUser, navigate]);

  const handleSwipe = async (direction) => {
  try {
    // 1. Validate critical data
    if (!currentUser?.uid || !profiles[currentIndex]?.id) {
      throw new Error("Invalid user data");
    }

    const swipedUser = profiles[currentIndex];
    const batch = writeBatch(db);

    // 2. Create swipe document
    const swipeRef = doc(db, "swipes", `${currentUser.uid}_${swipedUser.id}`);
    batch.set(swipeRef, {
      swiper: currentUser.uid,
      swiped: swipedUser.id,
      direction,
      timestamp: new Date(),
    });

    // 3. Check for mutual right swipe
    const theirSwipeRef = doc(db, "swipes", `${swipedUser.id}_${currentUser.uid}`);
    const theirSwipe = await getDoc(theirSwipeRef);

    if (theirSwipe.exists() && theirSwipe.data().direction === "right") {
      const matchRef = doc(db, "matches", `${currentUser.uid}_${swipedUser.id}`);
      batch.set(matchRef, {
        users: [currentUser.uid, swipedUser.id],
        timestamp: new Date(),
      });
    }

    // 4. Commit changes
    await batch.commit();
    setCurrentIndex(prev => prev + 1);

  } catch (err) {
    console.error("SWIPE ERROR DETAILS:", { 
      error: err,
      currentUser: currentUser?.uid,
      swipedUser: profiles[currentIndex]?.id
    });
    setError(`Swipe failed: ${err.message}`);
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