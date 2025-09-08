//import React, { useContext } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import { WorkerContext } from '../WorkerContext';

import { useAuth } from '../../provider/authProvider';


const Logout = () => {
    //const { user, setUser } = useContext(WorkerContext);
    const { user, setUser } = useAuth();
    const { setToken } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Send the logout request to the server if user exists
            if (user && user.id) {
                 await Axios.post(`${process.env.REACT_APP_API_URL}/logout`, 
                    { userId: user.id }, // Correct placement of userId in request body
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }
        } catch (error) {
            console.error('Error logging out:', error);
            // Even if server logout fails, we'll still clear client state
        }
        
        // Clear client state regardless of server response
        setUser(null);
        //setToken(null);
        localStorage.clear();
        
        // Navigate to login page
        navigate('/login', { replace: true });
        
        // Force a reload to ensure complete reset
        window.location.reload();
    };

    return (
        <button 
            className="bg-sa-green text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700" 
            onClick={handleLogout}
        >
            Logout
        </button>
    );
};

/*const Logout = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const handleLogout = async () => {
        try {
            // Send the logout request to the server
            await Axios.post(`${process.env.REACT_APP_API_URL}/logout`, 
                { userId: user?.id }, 
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (error) {
            console.error('Error during server logout:', error);
            // Continue with client-side cleanup even if server request fails
        }
        
        // Clear client state
        if (setUser) setUser(null);
        localStorage.removeItem('userId');
        
        // Navigate to login page
        navigate('/login', { replace: true });
    };

    return (
        <button 
            className="bg-sa-green text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors" 
            onClick={handleLogout}
        >
            Logout
        </button>
    );
};*/

export default Logout;