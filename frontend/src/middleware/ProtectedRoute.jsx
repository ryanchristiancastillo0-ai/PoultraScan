import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../middleware/AuthContext';

export default function ProtectedRoute() {
  const { user, initializing, fetchCurrentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Try to resolve the session from the httpOnly cookie on first load.
    fetchCurrentUser().catch(() => {}); // 401 is expected when logged out, don't crash
  }, [fetchCurrentUser]);

  if (initializing) {
    return <div className="min-h-[100dvh] flex items-center justify-center text-[#3d4a42]">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}