import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const EmailVerification = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verifyEmail = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            const email = params.get('email');

            try {
                const response = await Axios.get(`http://localhost:3001/verify-email?token=${token}&email=${email}`);

                if (response.status === 200) {
                    setMessage('Email verified successfully! You can now log in.');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setMessage('Failed to verify email. Please try again.');
                }
            } catch (error) {
                setMessage('Invalid or expired verification link.');
            }
        };

        verifyEmail();
    }, [location.search, navigate]);

    return (
        <div>
            <h2>Email Verification</h2>
            <p>{message}</p>
        </div>
    );
};

export default EmailVerification;
