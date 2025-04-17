import { Button, Typography, Container } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useAuth();

const handleLogout = () => {
    logout(); // Use the logout function from AuthContext
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>
        Welcome, {user?.name || user?.email}!
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