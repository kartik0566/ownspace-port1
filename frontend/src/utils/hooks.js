import { useEffect, useState } from 'react';

const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(storedUser());
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const login = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return { token, user, isAuthenticated, login, logout };
};

export const useFetch = (fetchFn) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchFn()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchFn]);

  return { data, loading, error };
};
