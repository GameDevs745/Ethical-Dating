// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/errorBoundary';
import { AuthProvider } from './contexts/AuthContext'; // ADD THIS IMPORT
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileForm from './components/ProfileForm';
import SwipePage from './components/SwipePage';
function App() {
  return (
    <ErrorBoundary>
    <AuthProvider> {/* ADD THIS WRAPPER */}
      <BrowserRouter>
<Routes>
  <Route path="/" element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  } />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/profile" element={
    <ProtectedRoute>
      <ProfileForm />
    </ProtectedRoute>
  } />
  <Route path="/swipe" element={
    <ProtectedRoute>
      <SwipePage />
    </ProtectedRoute>
  } />
</Routes>
      </BrowserRouter>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;