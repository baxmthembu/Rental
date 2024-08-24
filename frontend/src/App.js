import React, {useEffect} from "react";
import './App.css'
import {Route, BrowserRouter as Router, useNavigate} from 'react-router-dom';
import SearchBar from "./Components/SearchBar/searchbar";
import Register from "./Components/Register/register";
import { WorkerProvider } from "./Components/WorkerContext";
import Login from "./Components/Login/login";
import NavBar from "./Components/Navbar/navbar";
import Home from "./Components/Home/home";
import Card from "./Components/Cards/card";
import Properties from "./Components/Properties/properties";
import PrivateRoute from "./Components/PrivateRoute";
//import ProtectedRoute from "./Components/PrivateRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import AuthProvider from "./provider/authProvider";
import Routes from "./routes";

/*function App() {
  return (
    <div>
      <WorkerProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/navbar" element={<NavBar />} />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          <Route path="/searchbar" element={<PrivateRoute element={<SearchBar />} />} />
          <Route path="/card" element={<PrivateRoute element={<Card />} />} />
          <Route path="/properties" element={<PrivateRoute element={<Properties />} />} />
        </Routes>
      </WorkerProvider>
    </div>
  );
}*/

/*function App(){
  return(
    <AuthProvider>
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<SearchBar />} path="/searchbar" />
          <Route element={<Home />} path="/home" />
          <Route element={<Card />} path="/card" />
          <Route element={<Properties />} path="/properties" />
        </Route>
        <Route element={<Login />} path="/" />
      </Routes>
    </Router>
    </AuthProvider>
  )
}

export default App*/

//import AuthProvider from "./provider/authProvider";
//import Routes from "./routes";
//import {BrowserRouter as Router, useNavigate} from 'react-router-dom';


function App(){
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  )
}

export default App

/*export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}*/

