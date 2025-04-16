import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import signInWithEmailAndPassword
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { auth } from '../firebase'; // Import the pre-initialized `auth`

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the imported `auth` directly
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" align="center">Login</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Login
          </Button>
        </form>
        <Typography align="center" sx={{ mt: 2 }}>
          New user? <Link to="/signup">Sign Up</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;