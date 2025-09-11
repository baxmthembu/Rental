import { RouterProvider, createBrowserRouter } from "react-router-dom";
//import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import SearchBar from "../Components/SearchBar/searchbar";
import Properties from "../Components/Properties/properties"
import Login from "../Components/Login/login"
import Register from "../Components/Register/register";
import Favorites from "../Components/Favourites/favourites";
import AboutUs from "../Components/About_Us/about";
import Financing from "../Components/Financing/financing";
import ListProperties from "../Components/ListProperties/list_properties";
import Home from "../Components/Home/home";
import Advertising from "../Components/Advertise/advertise";
import LeaseAgreement from "../Components/Lease_Agreement/lease";


const Routes = () => {
    // Define public routes accessible to all users
    const routesForPublic = [
        /*{
            path: "/",
            element: <Home />,
        },*/
        {
            path: "/",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
    ];

    // Define routes accessible only to authenticated users
    const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/searchbar",
                    element: <SearchBar />,
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
                 {
                    path: "/home",
                    element: <Home />
                },
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