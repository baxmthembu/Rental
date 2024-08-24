/*import React, { useContext } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { WorkerContext } from '../WorkerContext';
import './logout.css'
import { useAuth } from '../../provider/authProvider';

const Logout = () => {
    const { user, setUser } = useContext(WorkerContext);
    const {token,setToken} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            if (!user || !user.id) {
                throw new Error('No user is logged in');
            }

            // Send the logout request to the server
            const response = await Axios.post('http://localhost:3001/logout', {
                userId: user.id
            });

            if (response.status === 200) {
                // Clear user context and localStorage only after successful logout
                setUser(null);
                setToken(null)
                localStorage.removeItem('userId');
                localStorage.removeItem('token')
                navigate('/login');
            } else {
                throw new Error('Failed to logout');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className="button-28" role="button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};


const styles = {
    button: {
        float: 'right',
        right: '20px',
        bottom: '1rem'
    }
  }

  export default Logout*/