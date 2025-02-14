import Axios from "axios";
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

export default AuthProvider