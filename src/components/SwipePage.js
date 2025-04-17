import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../data/userService';
import { swipeService } from '../data/swipeService.js';
import SwipeCard from './SwipeCard';
import { Container, Typography, Button, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';

const SwipePage = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [noMoreProfiles, setNoMoreProfiles] = useState(false);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true);
        const currentUser = await userService.getUser(user.id);
        const allUsers = await userService.getAllUsers();
        
        // Get already swiped users
        const swipes = await swipeService.getSwipesByUser(user.id);
        const swipedIds = swipes.map(swipe => swipe.swipeeId);

        const filtered = allUsers.filter(u => 
          u.id !== user.id &&
          (currentUser.preference === 'both' || u.gender === currentUser.preference) &&
          !swipedIds.includes(u.id)
        );

        setProfiles(filtered);
        setNoMoreProfiles(filtered.length === 0);
      } catch (err) {
        setError('Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) loadProfiles();
  }, [user]);

  const handleSwipe = async (direction) => {
    try {
      if (!profiles[currentIndex]) return;

      const swipeeId = profiles[currentIndex].id;
      
      // Record the swipe
      await swipeService.addSwipe({
        id: `${user.id}_${swipeeId}`,
        swiperId: user.id,
        swipeeId,
        direction,
        timestamp: new Date()
      });

      // Check for match
      if (direction === 'right') {
        const isMatch = await swipeService.checkForMatch(user.id, swipeeId);
        if (isMatch) {
          alert(`It's a match with ${profiles[currentIndex].name}!`);
        }
      }

      // Move to next profile
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setNoMoreProfiles(true);
      }
    } catch (err) {
      setError('Failed to process swipe');
      console.error('Swipe error:', err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Loading profiles...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4, position: 'relative', minHeight: 500 }}>
      {noMoreProfiles ? (
        <Typography variant="h5" align="center">
          No more profiles to show!
        </Typography>
      ) : (
        profiles[currentIndex] && (
          <>
            <SwipeCard
              profile={profiles[currentIndex]}
              onSwipeLeft={() => handleSwipe('left')}
              onSwipeRight={() => handleSwipe('right')}
            />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 2, 
              mt: 4 
            }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<CloseIcon />}
                onClick={() => handleSwipe('left')}
                sx={{ px: 4, py: 2 }}
              >
                Pass
              </Button>
              
              <Button
                variant="contained"
                color="success"
                startIcon={<FavoriteIcon />}
                onClick={() => handleSwipe('right')}
                sx={{ px: 4, py: 2 }}
              >
                Like
              </Button>
            </Box>
          </>
        )
      )}
    </Container>
  );
};

export default SwipePage;