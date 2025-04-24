import React, { useContext } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { WorkerContext } from '../WorkerContext';
import './logout.css'
import { useAuth } from '../../provider/authProvider';

const Logout = () => {
    const { user, setUser } = useContext(WorkerContext);
    const {setToken} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            if (!user || !user.id) {
                console.log('No user logged in')
                return;
            }

            // Send the logout request to the server
            const response = await Axios.post('http://localhost:3001/logout', {
                userId: user.id
            });

            if (response.status === 200) {
                // Clear user context and localStorage only after successful logout
                const handleLogOut = () => {
                    setUser(null)
                    setToken(null)
                    localStorage.clear()
                    navigate('/login', {replace: true})
                }
                // Navigate to a dummy route and then to login to force re-render
                navigate('/dummy');
                setTimeout(() => {
                    //navigate('/login');
                    handleLogOut()
                }, 0);
            } else {
                throw new Error('Failed to logout');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className="button-28" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};


  export default Logout