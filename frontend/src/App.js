import React from "react";
import './App.css'
import { Routes, Route, BrowserRouter as Router} from 'react-router-dom';
import SearchBar from "./Components/SearchBar/searchbar";
import Register from "./Components/Register/register";
import { WorkerProvider } from "./Components/WorkerContext";
import Login from "./Components/Login/login";
import NavBar from "./Components/Navbar/navbar";
import Home from "./Components/Home/home";
import Card from "./Components/Cards/card";
import Properties from "./Components/Properties/properties";


function App() {
  return (
    <>
      <body>
      <div>
        <WorkerProvider>
        <Routes>
          <Route path='/searchbar' element={<SearchBar />} />
          <Route path='/register' element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/navbar" element={<NavBar />} />
          <Route path="/home" element={<Home />} />
          <Route path='/card' element={<Card />} />
          <Route path='/properties' element={<Properties />} />
        </Routes>
        </WorkerProvider>
      </div>
      </body>
    </>
  );
}

export default App;
