/*import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { WorkerContext } from './WorkerContext'; // Import your context

const PrivateRoute = ({ children }) => {
    const { user } = useContext(WorkerContext);

    if (!user || !localStorage.getItem('userId')) {
        // If user is not logged in, redirect to login
        return <Navigate to="/" />;
    }

    // If user is logged in, render the child components
    return children;
};

export default PrivateRoute;*/

/*import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { WorkerContext } from './WorkerContext'; // Adjust the path as needed

const ProtectedRoute = ({ element }) => {
  const { user } = useContext(WorkerContext);

  return user ? element : <Navigate to="/" />;
};

export default ProtectedRoute;*/
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/*const ProtectedRoute = ({ element: Component, ...rest }) => {
  // Check if the user has a token in localStorage
  const token = localStorage.getItem('token');

  // If there's no token, redirect to the login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If the token exists, render the desired component
  return <Component {...rest} />;
};*/

const ProtectedRoute = () => {
    const token = localStorage.getItem('token')

    return(
        token ? <Outlet /> : <Navigate to='/' />
    )
}

export default ProtectedRoute;


