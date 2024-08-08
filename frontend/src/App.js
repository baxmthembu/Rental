import React from "react";
import './App.css'
import { Routes, Route, BrowserRouter as Router} from 'react-router-dom';
import SearchBar from "./Components/SearchBar/searchbar";
import Register from "./Components/Register/register";

function App() {
  return (
    <>
      <body>
      <div>
        <Routes>
          <Route path='/searchbar' element={<SearchBar />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </div>
      </body>
    </>
  );
}

export default App;
