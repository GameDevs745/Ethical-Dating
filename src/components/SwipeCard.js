// src/components/SwipeCard.js
import { Card, CardMedia, CardContent, Typography, IconButton, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';

const SwipeCard = ({ profile, onSwipeLeft, onSwipeRight }) => {
  return (
    <Card sx={{ maxWidth: 345, margin: 'auto', position: 'relative', minHeight: 400 }}>
      <CardMedia
        component="img"
        height="240"
        image={profile.photoURL || '/default-profile.jpg'}
        alt={profile.name}
      />
      <CardContent>
        <Typography variant="h5">
          {profile.name}, {profile.age}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {profile.bio}
        </Typography>
      </CardContent>
      <Box sx={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', gap: 1 }}>
        <IconButton color="error" onClick={onSwipeLeft}>
          <CloseIcon fontSize="large" />
        </IconButton>
        <IconButton color="success" onClick={onSwipeRight}>
          <FavoriteIcon fontSize="large" />
        </IconButton>
      </Box>
    </Card>
  );
};

export default SwipeCard;