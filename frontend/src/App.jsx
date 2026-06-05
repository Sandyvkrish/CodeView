import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import { useEffect } from "react"; // 👈 Added useEffect for sync handling
import axiosInstance from "./lib/axios"; // 👈 Added your custom axios instance

import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";

function App() {
  const { isSignedIn, isLoaded, user } = useUser(); // 👈 Destructured 'user' object here

  // 🚀 Manual Pipeline Sync: Creates user in MongoDB immediately on login
  useEffect(() => {
    const syncUserToDatabase = async () => {
      // Only sync if Clerk is fully loaded, user is signed in, and user object is present
      if (!isLoaded || !isSignedIn || !user) return;

      try {
        await axiosInstance.post("/users/sync", {
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          fullName: user.fullName,
          imageUrl: user.imageUrl,
        });
        console.log("🚀 Sync Success: User authenticated and saved to MongoDB");
      } catch (error) {
        console.error("⚠️ Sync Failure: Manual user sync error logged:", error);
      }
    };

    syncUserToDatabase();
  }, [user, isLoaded, isSignedIn]);

  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
      </Routes>
      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;