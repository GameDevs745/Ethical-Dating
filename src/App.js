import './firebase'; // Add this line to initialize Firebase early
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileForm from './components/ProfileForm';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfileForm />
    </ProtectedRoute>
  }
/>

        </Routes>
      </BrowserRouter>
  );
}

export default App;