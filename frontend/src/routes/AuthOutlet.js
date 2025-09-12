import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
//import Home from "../Components/Home/home";

const AuthOutlet = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    /*return (
        <Home>
            <Outlet />
        </Home>
    );*/
    return <Outlet />;
};

export default AuthOutlet;