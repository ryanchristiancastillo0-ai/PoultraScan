import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { registerUser, loginUser, logoutUser, getCurrentUser, googleLogin } from '../pages/auth/api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true); // true until first /auth/me check finishes
  const [error, setError] = useState(null);

  const register = useCallback(async ({ fullname, username, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await registerUser({ fullname, username, email, password });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    setLoading(true);
    setError(null);
    try {
      await loginUser({ email, password, rememberMe });
      const me = await getCurrentUser();
      setUser(me);
      return me;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    setError(null);
    try {
      const me = await getCurrentUser();
      setUser(me);
      return me;
    } catch (err) {
      setUser(null);
      // don't setError here — this runs silently on app load for logged-out visitors too
      throw err;
    } finally {
      setInitializing(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    setLoading(true);
    setError(null);
    try {
      await googleLogin(credential);
      const me = await getCurrentUser();
      setUser(me);
      return me;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Run once on app mount: check if a valid session cookie already exists.
  // This is what flips `initializing` to false so HomeRedirect / ProtectedRoute
  // stop showing "Loading..." forever.
  useEffect(() => {
    fetchCurrentUser().catch(() => {
      // no valid session — that's fine, fetchCurrentUser already cleared user
      // and set initializing to false in its finally block
    });
  }, [fetchCurrentUser]);

  const value = {
    user, loading, error, initializing,
    register, login, logout, fetchCurrentUser, loginWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}