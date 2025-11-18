import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

const RedirectAuthenticated = () => {
    const { user, loading, authChecked } = useAuth();

    // Show minimal loading only during initial auth check
    if (loading && !authChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-2 border-blue-200 rounded-full"></div>
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full absolute animate-spin"></div>
                </div>
            </div>
        );
    }

    // If user is authenticated, redirect to home
    if (user && authChecked) {
        return <Navigate to="/home" replace />;
    }

    // For login/register pages, show them immediately or after quick auth check
    return <Outlet />;
};

export default RedirectAuthenticated;