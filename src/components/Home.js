import { Button, Typography, Container } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { fakeAuth } from '../data/authService';

const Home = () => {
  const { currentUser } = useAuth();

const handleLogout = () => {
  fakeAuth.logout();
  window.location.reload(); // Force state update
};

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>
        Welcome, {currentUser?.email}!
      </Typography>
      <Button variant="contained" onClick={handleLogout} sx={{ mt: 2 }}>
        Logout
      </Button>
      <Button
  component={Link}
  to="/profile"
  variant="outlined"
  sx={{ mt: 2, ml: 2 }}
>
  Edit Profile
</Button>
<Button
  component={Link}
  to="/swipe"
  variant="contained"
  color="secondary"
  sx={{ mt: 2, ml: 2 }}
>
  Find Matches
</Button>
    </Container>
  );
};

export default Home;