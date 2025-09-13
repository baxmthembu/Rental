import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
//import Home from "../Components/Home/home";

const AuthOutlet = () => {
    const { user, loading } = useAuth();

     if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
                    </div>
                    <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    /*return (
        <Home>
            <Outlet />
        </Home>
    );*/
    return <Outlet />;
};

export default AuthOutlet;