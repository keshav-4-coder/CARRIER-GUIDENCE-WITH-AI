import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const AuthContext = createContext();

// Create and export the provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetchUserData(accessToken);
    }
  }, []);

  const fetchUserData = async (accessToken) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/user/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser({
        authenticated: true,
        name: response.data.name || 'User',
        interests: response.data.interests || 'general',
      });
    } catch (error) {
      console.error('Fetch User Error:', error.message, error.response?.data);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  const login = async (accessToken, refreshToken, name) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser({ authenticated: true, name: name || 'User', interests: 'general' });
    await fetchUserData(accessToken);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await axios.post(
          'http://127.0.0.1:8000/api/signout/',
          { refresh_token: refreshToken },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          }
        );
      } catch (error) {
        console.error('Logout Error:', error.message, error.response?.data);
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('profile');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};