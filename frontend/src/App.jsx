
import {SignedIn, SignInButton, SignedOut, SignOutButton, UserButton, useUser } from "@clerk/clerk-react";
import { BrowserRouter } from 'react-router';
import {Navigate, Route, Routes} from "react-router";
import HomePage from "./pages/HomePage";
import {Toaster} from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemsPage from "./pages/ProblemsPage";


function App() {
  
  const {isSignedIn, isLoaded}= useUser();
  // this will get rid of flickering effect when clicking on the loading 
  if (!isLoaded) return null;
  return (
    <>
    <Routes>
    <Route path="/" element={!isSignedIn ? <HomePage/> : <Navigate to={"/dashboard"}/>}/>
    <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to = {"/"}/>}/>
    <Route path ="/problems" element={isSignedIn ? <ProblemsPage/> : <Navigate to={"/"}/>}/>
    </Routes>
    <Toaster toastOptions={{ duration:3000 }}/>
    </>
  )
};

export default App;
