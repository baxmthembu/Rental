import React from "react";
import './App.css'
import { WorkerProvider } from "./Components/WorkerContext";
import AuthProvider from "./provider/authProvider";
import Routes from "./routes";
import ClearStorage from "./ClearStorage/clearstorage";

function App(){
  return (
    <AuthProvider>
      <WorkerProvider>
        <ClearStorage />
      <Routes />
      </WorkerProvider>
    </AuthProvider>  
  )
}

export default App
