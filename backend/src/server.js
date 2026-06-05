import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";
import userRoutes from "./routes/userRoutes.js"; // 👈 ADDED: Manual Sync Pipeline

const app = express();
const __dirname = path.resolve();

// 1. Dynamic CORS Engine
const allowedOrigins = [
  ENV.CLIENT_URL,                               // http://localhost:5173
  "https://codeview-production.up.railway.app"   // Your production deployment domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow internal/non-browser requests (like Postman or server-to-server)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site blocks traffic from origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Crucial: Allows browser to pass Clerk credentials/cookies
  })
);

// 2. Standard Middleware
app.use(express.json());
app.use(clerkMiddleware()); 

// 3. Application API Routes
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/users", userRoutes); // 👈 ADDED: Endpoint to bypass brittle webhooks

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

// 4. Production Asset Routing Compilation
if (ENV.NODE_ENV === "production") {
  // Serve built static frontend files
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Fix: Standard catch-all wildcard for single-page applications (React Router compatibility)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// 5. Database & Server Spinup
const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();