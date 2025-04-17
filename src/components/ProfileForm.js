import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { Button, TextField, Container, Typography, Box, Avatar } from '@mui/material';
import { MenuItem } from '@mui/material';

const ProfileForm = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState('');
const [preference, setPreference] = useState('');
const [photoURL, setPhotoURL] = useState('');

  // Load existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setName(docSnap.data().name || '');
        setAge(docSnap.data().age || '');
        setBio(docSnap.data().bio || '');
         setGender(docSnap.data().gender || '');
  setPreference(docSnap.data().preference || '');
  setPhotoURL(docSnap.data().photoURL || '');
      }
      setLoading(false);
    };
    fetchProfile();
  }, [currentUser]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!gender || !preference) {
    alert('Please select gender and preference');
    return;
  }
    await setDoc(doc(db, 'users', currentUser.uid), {
      name,
      age,
      bio,
      email: currentUser.email,
      uid: currentUser.uid,
      gender,
  preference,
  photoURL,
      createdAt: new Date(),
    });
    alert('Profile saved!');
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4">Your Profile</Typography>
        <Avatar sx={{ width: 100, height: 100, mx: 'auto', my: 2 }} />
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Age"
            type="number"
            margin="normal"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={4}
            margin="normal"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <TextField
  select
  fullWidth
  label="Gender"
  margin="normal"
  value={gender}
  onChange={(e) => setGender(e.target.value)}
>
  <MenuItem value="male">Male</MenuItem>
  <MenuItem value="female">Female</MenuItem>
  <MenuItem value="other">Other</MenuItem>
</TextField>

<TextField
  select
  fullWidth
  label="Interested In"
  margin="normal"
  value={preference}
  onChange={(e) => setPreference(e.target.value)}
>
  <MenuItem value="male">Male</MenuItem>
  <MenuItem value="female">Female</MenuItem>
  <MenuItem value="both">Both</MenuItem>
</TextField>

<TextField
  fullWidth
  label="Profile Picture URL"
  margin="normal"
  value={photoURL}
  onChange={(e) => setPhotoURL(e.target.value)}
/>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Save Profile
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ProfileForm;