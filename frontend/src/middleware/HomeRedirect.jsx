import { Navigate } from "react-router-dom";
import { useAuth } from "../middleware/AuthContext";

export default function HomeRedirect() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
   <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-3" role="status" aria-label="Loading page">
        <svg 
          className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-500" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Loading...</span>
      </div>
    </div>
    );
  }

  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}