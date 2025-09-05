/*import Axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

//createContext() creates an empty context object thaht will be used to share the authentication state and functions between components
const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [token, setToken_] = useState(localStorage.getItem('token'));

    const setToken = (newToken) => {
        setToken_(newToken)
    }

    useEffect(() => {
        console.log("Token updated:", token); // Debugging
        if(token){
            //if token exists set the authorization header in axios and localstorage
            Axios.defaults.headers.common['Authorization'] = "Bearer " + token;
            localStorage.setItem('token', token);
        }else{
            //if token is null or undefined remove the authorization header from axios and localstorage
            delete Axios.defaults.headers.common["Authorization"];
            localStorage.removeItem('token')
        }
    }, [token])

    //context value includes the token and setToken function
    //the token value is used as a dependency for memoization
    const contextValue = useMemo(() => ({
        token,
        setToken,
    }),[token]);

    return(
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

//useAuth is a custom hook that can be used in components to access the authentication context
export const useAuth = () => {
    return useContext(AuthContext)
}

export default AuthProvider*/

// In your authProvider.js
/*import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const value = {
    user,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};*/

// AuthProvider.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on app start
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/verify-auth`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const logout = async () => {
        try {
            await fetch('http://localhost:3001/logout', {
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
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};