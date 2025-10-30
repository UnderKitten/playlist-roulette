import { useState, useEffect, useCallback } from 'react';
import { spotifyService } from '../services/SpotifyService';

export const useSpotifyAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticated = spotifyService.isAuthenticated();
    setIsAuthenticated(authenticated);
    setLoading(false);
  }, []);

  const login = useCallback(() => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('spotify-access-token');
    localStorage.removeItem('spotify-expires-at');
    setIsAuthenticated(false);
    window.location.href = '/';
  }, []);

  return { 
    isAuthenticated, 
    loading, 
    login, 
    logout 
  };
};
