import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchUser, getToken } from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await fetchUser();
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
