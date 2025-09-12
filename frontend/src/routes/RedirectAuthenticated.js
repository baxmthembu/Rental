import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

const RedirectAuthenticated = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default RedirectAuthenticated;