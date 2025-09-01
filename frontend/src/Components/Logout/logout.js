import { useContext } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { WorkerContext } from '../WorkerContext';

import { useAuth } from '../../provider/authProvider';


const Logout = () => {
    const { user, setUser } = useContext(WorkerContext);
    const { setToken } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Send the logout request to the server if user exists
            if (user && user.id) {
                await Axios.post(`${process.env.REACT_APP_API_URL}/logout`, {
                    userId: user.id
                });
            }
        } catch (error) {
            console.error('Error logging out:', error);
            // Even if server logout fails, we'll still clear client state
        } finally {
            // Always clear client state and navigate
            setUser(null);
            setToken(null);
            localStorage.clear();
            navigate('/login', { replace: true });
        }
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

export default Logout;