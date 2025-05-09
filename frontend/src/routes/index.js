import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import SearchBar from "../Components/SearchBar/searchbar";
import Card from "../Components/Cards/card";
import Home from "../Components/Home/home";
import Properties from "../Components/Properties/properties"
import Login from "../Components/Login/login"
import Register from "../Components/Register/register";
import Favorites from "../Components/Favourites/favourites";


const Routes = () => {
    /*The useAuth hook is called to retrieve the token value from the authentication context. 
      It allows us to access the authentication token within the Routes component.*/
    const {token} = useAuth()

    //routes accessible only to authenticated users
    const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/searchbar",
                    element: <SearchBar />
                },
                {
                    path: "/card",
                    element: <Card />
                },
                {
                    path: "/home",
                    element: <Home />
                },
                {
                    path: "/properties",
                    element: <Properties />
                },
                {
                    path: "/favourites",
                    element: <Favorites />
                }
            ]
        }
    ]

    //routes accessible only to none authenticated users
    const routesForNotAuthenticatedOnly = [
        {
            path: "/",
            element: <Login />
        },
        {
            path: "/register",
            element: <Register />
        },
    ]

    // Catch-all route to handle 404s
    const catchAllRoute = {
        path: "*",
        element: token ? <Home /> : <Login />  // Redirect based on authentication state
    };

    //createBrowserRouter function is used to create the router configuration. It takes an array of routes as its argument
    //the spread operator (...) is used to merge the route arrays into a single array
    //The conditional expression (!token ? routesForNotAuthenticatedOnly : []) checks if the user is authenticated (token exists). If not, it includes the routesForNotAuthenticatedOnly array; otherwise, it includes an empty array.
    const router = createBrowserRouter([
        ...(!token ? routesForNotAuthenticatedOnly : []),
        ...routesForAuthenticatedOnly,
        catchAllRoute
    ])

    return <RouterProvider router={router} />
}

export default Routes