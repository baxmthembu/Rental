import { Navigate, Outlet } from "react-router-dom";
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
}