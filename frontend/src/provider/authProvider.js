import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false); // Changed to false by default
    const [authChecked, setAuthChecked] = useState(false);

    // Helper function to create timeout promise
    const createTimeoutPromise = (ms) => {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), ms);
        });
    };

    // Check if user is logged in on app start
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                setLoading(true);
                
                // Use Promise.race to add timeout - 3 seconds max for auth check
                const response = await Promise.race([
                    fetch(`${process.env.REACT_APP_API_URL}/verify-auth`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    }),
                    createTimeoutPromise(3000)
                ]);

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                // If auth check fails, assume user is not logged in
                setUser(null);
            } finally {
                setLoading(false);
                setAuthChecked(true);
            }
        };

        // Only check auth status after a small delay to prevent blocking initial render
        const timer = setTimeout(checkAuthStatus, 100);
        return () => clearTimeout(timer);
    }, []);

    const logout = async () => {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user?.id }),
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('userId');
        }
    };

    const value = {
        user,
        setUser,
        logout,
        loading,
        authChecked
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};