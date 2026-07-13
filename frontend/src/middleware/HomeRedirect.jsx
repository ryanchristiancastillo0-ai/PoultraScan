import { Navigate } from "react-router-dom";
import { useAuth } from "../middleware/AuthContext";
import { LoadingScreen } from "../components/index";

export default function HomeRedirect() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <LoadingScreen />;
  }

  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}