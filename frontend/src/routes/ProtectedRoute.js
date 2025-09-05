/*import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

export const ProtectedRoute = () => {
    //access the token from useAuth custom hook provided by the AuthContext
    //this hook allows us to retrieve the authentication toke stored in the context
    const { token } = useAuth()

    //check if user is authenticated
    if(!token) {
        //if not authenticated redirect to login page
        return <Navigate to='/login' />;
    }

    //if authenticated, render the child routes
    return <Outlet />
}*/

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify authentication by making a request to a protected endpoint
        const response = await fetch(`${process.env.REACT_APP_API_URL}/verify-auth`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData); // Update context with user data
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        navigate('/login', { replace: true });
      }
    };

    checkAuth();
  }, [navigate, setUser]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // Render protected content if authenticated
  return isAuthenticated ? <Outlet /> : null;
};