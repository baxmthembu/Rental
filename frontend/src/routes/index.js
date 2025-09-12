import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Outlet } from "react-router-dom";
import AuthOutlet from "./AuthOutlet";
import RedirectAuthenticated from "./RedirectAuthenticated";
import Properties from "../Components/Properties/properties"
import Login from "../Components/Login/login"
import Register from "../Components/Register/register";
import Favorites from "../Components/Favourites/favourites";
import AboutUs from "../Components/About_Us/about";
import Financing from "../Components/Financing/financing";
import ListProperties from "../Components/ListProperties/list_properties";
import Advertising from "../Components/Advertise/advertise";
import LeaseAgreement from "../Components/Lease_Agreement/lease";
import { Navigate } from "react-router-dom";


const Routes = () => {
    //const { token } = useAuth();

    // Define public routes accessible to all users
    const routesForPublic = [
        {
            path: "/",
            element: <RedirectAuthenticated />,
            children: [
                {index: true, element: <Navigate to="/login" replace/>},
                { path: "/login", element: <Login /> },
                { path: "/register", element: <Register /> },
            ],
        },
    ];

    // Define routes accessible only to authenticated users
    /*const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <AuthOutlet />,
            children: [
                {index: true, element: <Navigate to="/home" replace/>},
                {
                    path: "/home",
                    element: (
                        <>
                            <Outlet />
                        </>
                    ),
                },
                {
                    path: "/list_properties",
                    element: <ListProperties />,
                },
                {
                    path: "/properties",
                    element: <Properties />,
                },
                {
                    path: "/favourites",
                    element: <Favorites />,
                },
                {
                    path: "/about",
                    element: <AboutUs />,
                },
                {
                    path: "/financing",
                    element: <Financing />,
                },
                {
                    path: "/advertise",
                    element: <Advertising />,
                },
                {
                    path: "/lease",
                    element: <LeaseAgreement />,
                },
            ],
        },
    ];*/
     const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <AuthOutlet />,
            children: [
                { path: "/home", element: <HomeContent /> },
                { path: "/list_properties", element: <ListProperties /> },
                { path: "/properties", element: <Properties /> },
                { path: "/favourites", element: <Favorites /> },
                { path: "/about", element: <AboutUs /> },
                { path: "/financing", element: <Financing /> },
                { path: "/advertise", element: <Advertising /> },
                { path: "/lease", element: <LeaseAgreement /> },
                // Redirect any unknown routes to home
                { path: "*", element: <Navigate to="/home" replace /> },
            ],
        },
    ];


    // Combine and configure routes
    const router = createBrowserRouter([
        ...routesForPublic,
        ...routesForAuthenticatedOnly,
    ]);

    // Provide the router configuration
    return <RouterProvider router={router} />;
};

export default Routes