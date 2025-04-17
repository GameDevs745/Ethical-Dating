import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../data/userService';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  TextField, 
  Container, 
  Typography, 
  Box, 
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import { MenuItem } from '@mui/material';

const ProfileForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bio: '',
    gender: '',
    preference: '',
    photoURL: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await userService.getUser(user.id);
        if (profile) {
          setFormData({
            name: profile.name || '',
            age: profile.age || '',
            bio: profile.bio || '',
            gender: profile.gender || '',
            preference: profile.preference || '',
            photoURL: profile.photoURL || ''
          });
        }
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) loadProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.gender) {
      setError('Please select your gender');
      return false;
    }
    if (!formData.preference) {
      setError('Please select your preference');
      return false;
    }
    if (formData.age < 18) {
      setError('You must be at least 18 years old');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) return;

    try {
      await userService.saveUser({
        id: user.id,
        email: user.email,
        ...formData,
        age: Number(formData.age),
        createdAt: new Date()
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Failed to save profile');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Your Profile
        </Typography>

        <Avatar
          src={formData.photoURL}
          sx={{ 
            width: 100, 
            height: 100, 
            mx: 'auto', 
            mb: 2,
            border: '2px solid #1976d2'
          }}
        />

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Profile saved successfully!</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            margin="normal"
            value={formData.age}
            onChange={handleChange}
            inputProps={{ min: 18, max: 100 }}
            required
          />

          <TextField
            fullWidth
            label="Bio"
            name="bio"
            multiline
            rows={4}
            margin="normal"
            value={formData.bio}
            onChange={handleChange}
            inputProps={{ maxLength: 500 }}
          />

          <TextField
            select
            fullWidth
            label="Gender"
            name="gender"
            margin="normal"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            label="Interested In"
            name="preference"
            margin="normal"
            value={formData.preference}
            onChange={handleChange}
            required
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="both">Both</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Profile Picture URL"
            name="photoURL"
            margin="normal"
            value={formData.photoURL}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
          />

          <Button 
            type="submit" 
            variant="contained" 
            size="large" 
            sx={{ mt: 3, px: 4 }}
          >
            Save Profile
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ProfileForm;