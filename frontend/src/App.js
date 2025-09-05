import './App.css'
import { WorkerProvider } from "./Components/WorkerContext";
import {AuthProvider} from "./provider/authProvider";
import Routes from "./routes";
import ClearStorage from "./ClearStorage/clearstorage";
import { LikedPropertiesProvider } from "./Components/LikedPropertiesContext/LikedPropertiesContext";
import { AuthProviders } from './Components/AuthContext';


function App(){
  return (
    <AuthProvider>
    {/*<AuthProviders>*/}
      <WorkerProvider>
        <ClearStorage />
        <LikedPropertiesProvider>
          {/* The Routes component contains all the routes of the application */}
          {/* It is wrapped in the AuthProvider to provide authentication context */}
          {/* and in the WorkerProvider to provide worker context */}
          {/* and in the LikedPropertiesProvider to provide liked properties context */}
          {/* This allows us to access authentication, worker, and liked properties context throughout the application */}
          <Routes />
        </LikedPropertiesProvider>
      </WorkerProvider>
      {/*</AuthProviders>*/}
    </AuthProvider>  
  )
}

export default App
